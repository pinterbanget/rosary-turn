// Quran Turn · notch host (macOS 12+).
//
// A small AppKit shell around the reader's notch page (app/notch.html, served
// by the local quran-turn server). It draws a black shape that sits exactly on
// the MacBook notch, grows out of it like a curtain while your agent works and
// folds back in when the turn ends. On a Mac without a notch the same shape
// comes out of the middle of the menu bar.
//
// Everything about reading (the verified Qur'an text, your place, the agent's
// state, when to open or close) lives in the page. This file only draws,
// animates and passes a few events back and forth. It is compiled on your Mac
// by quran-turn (src/notch.mjs); no prebuilt binary ships with the plugin.
import AppKit
import WebKit

// MARK: - Options

struct Options {
  var base = URL(string: "http://127.0.0.1:47114/")!
  var build = ""
}

func parseOptions() -> Options {
  var o = Options()
  let args = CommandLine.arguments
  var i = 1
  while i < args.count {
    if args[i] == "--url", i + 1 < args.count,
       let u = URL(string: args[i + 1]), u.scheme == "http", u.host == "127.0.0.1" {
      o.base = u
      i += 1
    } else if args[i] == "--build", i + 1 < args.count {
      o.build = String(args[i + 1].prefix(64))
      i += 1
    }
    i += 1
  }
  return o
}

// MARK: - Geometry

struct Geometry {
  let screen: NSScreen
  let hasNotch: Bool
  let notch: CGSize // the physical notch, or a pill in the menu bar

  static func current() -> Geometry {
    let screens = NSScreen.screens
    let screen = screens.first { $0.safeAreaInsets.top > 0 } ?? NSScreen.main ?? screens[0]
    let top = screen.safeAreaInsets.top
    if top > 0, let l = screen.auxiliaryTopLeftArea, let r = screen.auxiliaryTopRightArea {
      return Geometry(screen: screen, hasNotch: true, notch: CGSize(width: screen.frame.width - l.width - r.width, height: top))
    }
    let bar = max(24, screen.frame.maxY - screen.visibleFrame.maxY)
    return Geometry(screen: screen, hasNotch: false, notch: CGSize(width: 190, height: bar))
  }
}

let cardWidth: CGFloat = 460
let earMax: CGFloat = 10 // the outward flare where the shape meets the top edge
let openRadius: CGFloat = 24

// Motion curves
func clamp(_ x: Double) -> Double { max(0, min(1, x)) }
func easeOutCubic(_ x: Double) -> Double { 1 - pow(1 - x, 3) }
func easeInOutCubic(_ x: Double) -> Double { x < 0.5 ? 4 * x * x * x : 1 - pow(-2 * x + 2, 3) / 2 }
func easeInCubic(_ x: Double) -> Double { x * x * x }
// A soft spring: a little past 1, then settles (about 6% overshoot).
func spring(_ x: Double) -> Double { x >= 1 ? 1 : 1 - exp(-7 * x) * cos(8 * x) }
func lerp(_ a: CGFloat, _ b: CGFloat, _ t: Double) -> CGFloat { a + (b - a) * CGFloat(t) }

// MARK: - Views

final class NotchPanel: NSPanel {
  override var canBecomeKey: Bool { true }
  override var canBecomeMain: Bool { false }
  // Borderless windows may sit over the menu bar; never nudge us below it.
  override func constrainFrameRect(_ frameRect: NSRect, to screen: NSScreen?) -> NSRect { frameRect }
}

// The black shape. Top edge flush with the screen, small flares ("ears") where
// it meets the top, rounded bottom corners that grow as it opens.
final class ShapeView: NSView {
  var collapsed = CGSize(width: 200, height: 32)
  var expandedHeight: CGFloat = 220
  let fill = CAShapeLayer()
  let mask = CAShapeLayer()
  let content = NSView()
  // A tiny pill on the notch's bottom edge: Quran Turn is here. Barely there
  // at rest, breathing while your agent works, brighter under the pointer.
  let indicator = CALayer()
  var agentWorking = false { didSet { updateIndicator() } }
  var hovering = false { didSet { updateIndicator() } }
  var onHover: ((Bool) -> Void)?
  var onClick: (() -> Void)?

  override init(frame: NSRect) {
    super.init(frame: frame)
    wantsLayer = true
    layer?.addSublayer(fill)
    fill.fillColor = NSColor.black.cgColor
    content.wantsLayer = true
    addSubview(content)
    indicator.cornerRadius = 1.5
    layer?.addSublayer(indicator)
    updateIndicator()
    addTrackingArea(NSTrackingArea(rect: .zero, options: [.mouseEnteredAndExited, .activeAlways, .inVisibleRect], owner: self))
  }
  required init?(coder: NSCoder) { fatalError() }

  static let racingGreen = NSColor(srgbRed: 0.0, green: 0.26, blue: 0.15, alpha: 1)   // #004226
  static let restGreen = NSColor(srgbRed: 0.06, green: 0.36, blue: 0.24, alpha: 1)    // a touch brighter
  static let hoverTeal = NSColor(srgbRed: 0.14, green: 0.61, blue: 0.52, alpha: 1)    // #239c84, the reader's teal

  func updateIndicator() {
    indicator.removeAnimation(forKey: "breathe")
    CATransaction.begin()
    CATransaction.setAnimationDuration(0.25)
    if hovering {
      indicator.backgroundColor = ShapeView.hoverTeal.cgColor
    } else if agentWorking {
      indicator.backgroundColor = ShapeView.restGreen.cgColor
      if !NSWorkspace.shared.accessibilityDisplayShouldReduceMotion {
        let a = CABasicAnimation(keyPath: "backgroundColor")
        a.fromValue = ShapeView.racingGreen.cgColor
        a.toValue = ShapeView.restGreen.cgColor
        a.duration = 1.6
        a.autoreverses = true
        a.repeatCount = .infinity
        a.timingFunction = CAMediaTimingFunction(name: .easeInEaseOut)
        indicator.add(a, forKey: "breathe")
      }
    } else {
      indicator.backgroundColor = ShapeView.racingGreen.cgColor
    }
    CATransaction.commit()
  }

  // 0 at the notch, 1 once the card is a little way down.
  var progress: CGFloat { max(0, min(1, (bounds.height - collapsed.height) / 40)) }
  var ear: CGFloat { earMax * progress }

  func path(_ size: CGSize) -> CGPath {
    let W = size.width, H = size.height
    let e = min(ear, H / 2)
    let r = min((W - 2 * e) / 2, H / 2, lerp(collapsed.height * 0.3, openRadius, Double(progress)))
    let p = CGMutablePath()
    p.move(to: CGPoint(x: 0, y: H))
    p.addLine(to: CGPoint(x: W, y: H))
    p.addCurve(to: CGPoint(x: W - e, y: H - e), control1: CGPoint(x: W - e * 0.45, y: H), control2: CGPoint(x: W - e, y: H - e * 0.45))
    p.addLine(to: CGPoint(x: W - e, y: r))
    p.addArc(tangent1End: CGPoint(x: W - e, y: 0), tangent2End: CGPoint(x: W - e - r, y: 0), radius: r)
    p.addLine(to: CGPoint(x: e + r, y: 0))
    p.addArc(tangent1End: CGPoint(x: e, y: 0), tangent2End: CGPoint(x: e, y: r), radius: r)
    p.addLine(to: CGPoint(x: e, y: H - e))
    p.addCurve(to: CGPoint(x: 0, y: H), control1: CGPoint(x: e, y: H - e * 0.45), control2: CGPoint(x: e * 0.45, y: H))
    p.closeSubpath()
    return p
  }

  override func layout() {
    super.layout()
    CATransaction.begin()
    CATransaction.setDisableActions(true)
    let shape = path(bounds.size)
    fill.frame = bounds
    fill.path = shape
    content.frame = bounds
    if content.layer?.mask == nil { content.layer?.mask = mask }
    mask.frame = bounds
    mask.path = shape
    // 22×3, centred 5 px above the bottom edge; gone as soon as the card opens.
    indicator.frame = CGRect(x: (bounds.width - 22) / 2, y: 5, width: 22, height: 3)
    indicator.opacity = Float(max(0, 1 - progress * 3))
    indicator.zPosition = 1
    // The page keeps its full size and is revealed by the shape (the curtain),
    // anchored at the top, inside the flares.
    if let web = content.subviews.first {
      web.frame = NSRect(x: earMax, y: bounds.height - expandedHeight, width: cardWidth, height: expandedHeight)
    }
    CATransaction.commit()
  }

  override func acceptsFirstMouse(for event: NSEvent?) -> Bool { true }
  override func mouseEntered(with event: NSEvent) { hovering = true; onHover?(true) }
  override func mouseExited(with event: NSEvent) { hovering = false; onHover?(false) }
  override func mouseDown(with event: NSEvent) { onClick?() }
}

// MARK: - Host

final class NotchHost: NSObject, NSApplicationDelegate, WKScriptMessageHandler, WKNavigationDelegate, WKUIDelegate {
  let options: Options
  var geo = Geometry.current()
  let panel: NotchPanel
  let shape = ShapeView(frame: .zero)
  var web: WKWebView!
  var isOpen = false
  var contentHeight: CGFloat = 220
  var size = CGSize.zero // the shape's current body size (without flares)
  var timer: Timer?
  var loadFailures = 0

  init(options: Options) {
    self.options = options
    panel = NotchPanel(contentRect: .zero, styleMask: [.borderless, .nonactivatingPanel], backing: .buffered, defer: false)
    super.init()
  }

  func applicationDidFinishLaunching(_ note: Notification) {
    // One host at a time.
    let mine = NSRunningApplication.current
    if let id = Bundle.main.bundleIdentifier,
       NSRunningApplication.runningApplications(withBundleIdentifier: id).contains(where: { $0 != mine }) {
      NSApp.terminate(nil)
      return
    }

    panel.isOpaque = false
    panel.backgroundColor = .clear
    panel.hasShadow = false
    panel.level = NSWindow.Level(rawValue: NSWindow.Level.mainMenu.rawValue + 3)
    panel.collectionBehavior = [.canJoinAllSpaces, .stationary, .fullScreenAuxiliary, .ignoresCycle]
    panel.isMovable = false
    panel.hidesOnDeactivate = false
    panel.isReleasedWhenClosed = false
    panel.acceptsMouseMovedEvents = true
    panel.contentView = shape
    shape.onHover = { [weak self] inside in self?.emit(inside ? "hover-in" : "hover-out") }
    shape.onClick = { [weak self] in if self?.isOpen == false { self?.emit("click") } }

    let config = WKWebViewConfiguration()
    config.userContentController.add(self, name: "notch")
    web = WKWebView(frame: NSRect(x: 0, y: 0, width: cardWidth, height: contentHeight), configuration: config)
    web.setValue(false, forKey: "drawsBackground")
    if #available(macOS 12.0, *) { web.underPageBackgroundColor = .clear }
    web.navigationDelegate = self
    web.uiDelegate = self
    web.alphaValue = 0
    web.isHidden = true
    shape.content.addSubview(web)

    NotificationCenter.default.addObserver(self, selector: #selector(screensChanged), name: NSApplication.didChangeScreenParametersNotification, object: nil)
    applyGeometry()
    size = geo.notch
    place(size)
    if geo.hasNotch { panel.orderFrontRegardless() } // sits on the notch, invisible
    load()

    // With QURAN_NOTCH_SNAPSHOT, also capture the folded notch and its pill.
    DispatchQueue.main.asyncAfter(deadline: .now() + 2) { [weak self] in
      if self?.isOpen == false { self?.writeSnapshot(suffix: "-idle") }
    }

    // QURAN_NOTCH_DEBUG=1: print the page's curtain state twice a second.
    if ProcessInfo.processInfo.environment["QURAN_NOTCH_DEBUG"] == "1" {
      Timer.scheduledTimer(withTimeInterval: 0.5, repeats: true) { [weak self] _ in
        self?.web.evaluateJavaScript("JSON.stringify(window.__notchDebug && window.__notchDebug())") { r, _ in
          print("page", r ?? "nil", "native open", self?.isOpen ?? false, "size", self?.size ?? .zero)
          fflush(stdout)
        }
      }
    }
  }

  func load() {
    var c = URLComponents(url: options.base.appendingPathComponent("notch.html"), resolvingAgainstBaseURL: false)!
    c.queryItems = [
      URLQueryItem(name: "nw", value: geo.hasNotch ? String(Int(geo.notch.width)) : "0"),
      URLQueryItem(name: "nh", value: String(Int(geo.notch.height))),
      URLQueryItem(name: "build", value: options.build),
      URLQueryItem(name: "host", value: "mac"),
    ]
    web.load(URLRequest(url: c.url!))
  }

  func applyGeometry() {
    shape.collapsed = geo.notch
    shape.expandedHeight = contentHeight
  }

  @objc func screensChanged() {
    let hadNotch = geo.hasNotch
    geo = Geometry.current()
    applyGeometry()
    size = isOpen ? CGSize(width: cardWidth, height: contentHeight) : geo.notch
    place(size)
    if !isOpen { geo.hasNotch ? panel.orderFrontRegardless() : panel.orderOut(nil) }
    if hadNotch != geo.hasNotch { load() } // the page lays out around the notch
  }

  // Window frame for a shape of body size `s`, hanging from the top centre.
  func place(_ s: CGSize) {
    let ear = earMax * max(0, min(1, (s.height - geo.notch.height) / 40))
    let w = s.width + 2 * ear
    let f = geo.screen.frame
    panel.setFrame(NSRect(x: round(f.midX - w / 2), y: f.maxY - s.height, width: w, height: s.height), display: true)
  }

  // Drives an animation at display rate: step(t) gets 0…1.
  func animate(duration: Double, step: @escaping (Double) -> Void, done: (() -> Void)? = nil) {
    timer?.invalidate()
    let start = CACurrentMediaTime()
    let reduce = NSWorkspace.shared.accessibilityDisplayShouldReduceMotion
    let length = reduce ? min(duration, 0.18) : duration
    let t = Timer(timeInterval: 1.0 / 120.0, repeats: true) { [weak self] timer in
      let x = clamp((CACurrentMediaTime() - start) / length)
      step(x)
      if x >= 1 {
        timer.invalidate()
        if self?.timer === timer { self?.timer = nil }
        done?()
      }
    }
    timer = t
    RunLoop.main.add(t, forMode: .common)
  }

  // The curtain: widen just past the notch, then drop with a soft spring.
  func open(focus: Bool) {
    if !isOpen {
      isOpen = true
      let from = size
      web.isHidden = false
      panel.orderFrontRegardless()
      animate(duration: 0.62, step: { [weak self] x in
        guard let self else { return }
        // Read the height each frame: the page may report a new one mid-drop.
        let to = CGSize(width: cardWidth, height: self.contentHeight)
        let wP = easeOutCubic(clamp(x / 0.42))
        let hP = spring(clamp((x - 0.12) / 0.88))
        self.size = CGSize(width: lerp(from.width, to.width, wP), height: max(from.height, lerp(from.height, to.height, hP)))
        self.place(self.size)
        self.web.alphaValue = CGFloat(clamp((x - 0.35) / 0.4))
      }, done: { [weak self] in
        guard let self else { return }
        self.size = CGSize(width: cardWidth, height: self.contentHeight)
        self.place(self.size)
        self.emit("opened")
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.6) { self.writeSnapshot() }
      })
    }
    if focus {
      panel.makeKey()
      panel.makeFirstResponder(web)
    }
  }

  // Back into the notch: content fades, the curtain rises, then narrows.
  func close() {
    guard isOpen else { return }
    isOpen = false
    let from = size
    let to = geo.notch
    animate(duration: 0.5, step: { [weak self] x in
      guard let self else { return }
      self.web.alphaValue = CGFloat(1 - clamp(x / 0.22))
      let hP = easeInOutCubic(clamp(x / 0.72))
      let wP = easeInCubic(clamp((x - 0.45) / 0.55))
      self.size = CGSize(width: lerp(from.width, to.width, wP), height: lerp(from.height, to.height, hP))
      self.place(self.size)
    }, done: { [weak self] in
      guard let self else { return }
      self.size = to
      self.web.isHidden = true
      // Hiding the panel hands the keyboard back to whatever you were using.
      self.panel.orderOut(nil)
      if self.geo.hasNotch {
        self.place(to)
        self.panel.orderFrontRegardless()
      }
      self.emit("closed")
    })
  }

  // The page grew or shrank (alert strip, a longer ayah). The page is anchored
  // at the top, so only the shape's height needs to follow.
  func setHeight(_ h: CGFloat) {
    let target = max(90, min(420, h))
    guard abs(target - contentHeight) >= 1 else { return }
    contentHeight = target
    shape.expandedHeight = target
    shape.needsLayout = true
    guard isOpen, timer == nil else { return } // the open animation reads contentHeight itself
    let start = size
    animate(duration: 0.28, step: { [weak self] x in
      guard let self else { return }
      self.size = CGSize(width: start.width, height: lerp(start.height, target, easeOutCubic(x)))
      self.place(self.size)
    })
  }

  // QURAN_NOTCH_SNAPSHOT=/path.png: after each opening, draw the card (shape +
  // page) into a PNG. For checking the design without screen recording rights.
  func writeSnapshot(suffix: String = "") {
    guard var path = ProcessInfo.processInfo.environment["QURAN_NOTCH_SNAPSHOT"] else { return }
    if !suffix.isEmpty { path = path.replacingOccurrences(of: ".png", with: "\(suffix).png") }
    let bounds = shape.bounds
    let webFrame = web.frame
    let pill = (frame: shape.indicator.frame, color: shape.indicator.backgroundColor, alpha: CGFloat(shape.indicator.opacity))
    web.takeSnapshot(with: nil) { [weak self] image, _ in
      guard let self else { return }
      let scale: CGFloat = 4
      let w = Int(bounds.width * scale), h = Int(bounds.height * scale)
      guard let ctx = CGContext(data: nil, width: w, height: h, bitsPerComponent: 8, bytesPerRow: 0,
                                space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue) else { return }
      ctx.scaleBy(x: scale, y: scale)
      // What the screen shows around it: a light menu bar strip for contrast.
      ctx.setFillColor(NSColor(white: 0.93, alpha: 1).cgColor)
      ctx.fill(bounds)
      let shapePath = self.shape.path(bounds.size)
      ctx.addPath(shapePath)
      ctx.setFillColor(NSColor.black.cgColor)
      ctx.fillPath()
      ctx.addPath(shapePath)
      ctx.clip()
      if !self.web.isHidden, let cg = image?.cgImage(forProposedRect: nil, context: nil, hints: nil) {
        ctx.draw(cg, in: webFrame)
      }
      if pill.alpha > 0, let color = pill.color {
        ctx.setAlpha(pill.alpha)
        ctx.addPath(CGPath(roundedRect: pill.frame, cornerWidth: 1.5, cornerHeight: 1.5, transform: nil))
        ctx.setFillColor(color)
        ctx.fillPath()
      }
      guard let out = ctx.makeImage() else { return }
      let rep = NSBitmapImageRep(cgImage: out)
      try? rep.representation(using: .png, properties: [:])?.write(to: URL(fileURLWithPath: path))
    }
  }

  func emit(_ event: String) {
    web?.evaluateJavaScript("window.__notch && window.__notch(\(String(reflecting: event)))", completionHandler: nil)
  }

  // MARK: Page → host

  func userContentController(_ controller: WKUserContentController, didReceive message: WKScriptMessage) {
    guard let body = message.body as? [String: Any], let type = body["type"] as? String else { return }
    if ProcessInfo.processInfo.environment["QURAN_NOTCH_DEBUG"] == "1" { print("msg", body); fflush(stdout) }
    switch type {
    case "open": open(focus: (body["focus"] as? Bool) ?? false)
    case "close": close()
    case "height":
      if let v = body["value"] as? Double { setHeight(CGFloat(v)) }
    case "status":
      shape.agentWorking = (body["value"] as? String) == "working"
    case "quit": NSApp.terminate(nil)
    default: break
    }
  }

  // MARK: Navigation: only the local reader loads here; links open in your browser.

  func webView(_ webView: WKWebView, decidePolicyFor action: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
    guard let url = action.request.url else { return decisionHandler(.cancel) }
    if url.host == options.base.host && url.port == options.base.port { return decisionHandler(.allow) }
    if url.scheme == "https" || url.scheme == "http" { NSWorkspace.shared.open(url) }
    decisionHandler(.cancel)
  }

  func webView(_ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration, for action: WKNavigationAction, windowFeatures: WKWindowFeatures) -> WKWebView? {
    if let url = action.request.url, url.scheme == "https" { NSWorkspace.shared.open(url) }
    return nil
  }

  func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) { loadFailures = 0 }

  // The server isn't up yet (or restarted for an update): keep trying a while.
  func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
    loadFailures += 1
    if loadFailures > 40 { NSApp.terminate(nil) } // about two minutes
    DispatchQueue.main.asyncAfter(deadline: .now() + 3) { [weak self] in self?.load() }
  }

  func webViewWebContentProcessDidTerminate(_ webView: WKWebView) { load() }
}

// MARK: - Main

let app = NSApplication.shared
app.setActivationPolicy(.accessory)
let host = NotchHost(options: parseOptions())
app.delegate = host
app.run()
