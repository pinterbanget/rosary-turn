// The notch surface's host. On macOS it is native/RosaryNotch.swift, compiled on
// this machine the first time (no prebuilt binaries ship with rosary-turn) and
// cached by a hash of its source. On Windows it is native/notch-win.ps1, which
// runs the reader in a frameless Edge app window (experimental, opt-in).
import { execFile, execFileSync, spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './rosary.mjs';
import { home, logError } from './state.mjs';

const SWIFT = join(ROOT, 'native', 'RosaryNotch.swift');
const PS1 = join(ROOT, 'native', 'notch-win.ps1');
const APP_NAME = 'RosaryTurnNotch';
const disabled = () => Boolean(process.env.ROSARY_TURN_NO_WINDOW);

let mac; // cached macOS major version
const macMajor = () => {
  if (mac === undefined) {
    try { mac = Number(execFileSync('sw_vers', ['-productVersion'], { encoding: 'utf8', timeout: 2000 }).split('.')[0]) || 0; } catch { mac = 0; }
  }
  return mac;
};
let swiftc; // cached: path to swiftc, or '' when there is none
function findSwiftc() {
  if (swiftc === undefined) {
    try { swiftc = execFileSync('xcrun', ['--find', 'swiftc'], { encoding: 'utf8', timeout: 5000, stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { swiftc = ''; }
  }
  return swiftc;
}

// explicit: the user asked for the notch (`rosary-turn surface notch`).
// macOS 12+ with the Swift compiler (Command Line Tools) by default; Windows
// only when asked for, while it is experimental.
export function notchSupported({ explicit = false } = {}) {
  if (disabled()) return false;
  if (process.platform === 'darwin') return macMajor() >= 12 && Boolean(findSwiftc());
  if (process.platform === 'win32') return explicit;
  return false;
}

const hashOf = (file) => createHash('sha256').update(readFileSync(file)).digest('hex').slice(0, 12);

// Identifies the host build; the page relaunches the host when this changes.
export function notchBuild() {
  try {
    if (process.platform === 'darwin') return hashOf(SWIFT);
    if (process.platform === 'win32') return hashOf(PS1);
  } catch {}
  return null;
}

const INFO_PLIST = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>CFBundleIdentifier</key><string>tech.allrize.rosary-turn.notch</string>
  <key>CFBundleName</key><string>Rosary Turn</string>
  <key>CFBundleExecutable</key><string>${APP_NAME}</string>
  <key>CFBundlePackageType</key><string>APPL</string>
  <key>CFBundleShortVersionString</key><string>1</string>
  <key>LSMinimumSystemVersion</key><string>12.0</string>
  <key>LSUIElement</key><true/>
  <key>NSAppTransportSecurity</key><dict><key>NSAllowsLocalNetworking</key><true/></dict>
</dict></plist>
`;

const run = (cmd, args, timeout) =>
  new Promise((resolve, reject) => {
    execFile(cmd, args, { timeout }, (err, stdout, stderr) => (err ? reject(new Error(`${cmd} failed: ${stderr || err.message}`)) : resolve(stdout)));
  });

let building = null;
// → path to the host executable, compiling it first if this source is new.
export function buildMacHost() {
  const build = notchBuild();
  const dir = join(home(), 'notch');
  const app = join(dir, `${APP_NAME}-${build}.app`);
  const exe = join(app, 'Contents', 'MacOS', APP_NAME);
  if (existsSync(exe)) return Promise.resolve(exe);
  building ??= (async () => {
    const tmp = join(dir, `.build-${process.pid}-${Date.now()}.app`);
    mkdirSync(join(tmp, 'Contents', 'MacOS'), { recursive: true });
    writeFileSync(join(tmp, 'Contents', 'Info.plist'), INFO_PLIST);
    await run('xcrun', ['swiftc', '-O', '-o', join(tmp, 'Contents', 'MacOS', APP_NAME), SWIFT, '-framework', 'AppKit', '-framework', 'WebKit'], 300_000);
    await run('codesign', ['--force', '--sign', '-', tmp], 30_000).catch(logError); // ad-hoc, best effort
    rmSync(app, { recursive: true, force: true });
    renameSync(tmp, app);
    // Old builds from earlier versions.
    for (const name of readdirSync(dir)) {
      if (name !== `${APP_NAME}-${build}.app`) rmSync(join(dir, name), { recursive: true, force: true });
    }
    return exe;
  })().finally(() => { building = null; });
  return building;
}

// Starts the host for the reader at `url`. Resolves false if it can't run here.
export async function openNotch(url) {
  if (disabled()) return false;
  try {
    if (process.platform === 'darwin') {
      const exe = await buildMacHost();
      spawn(exe, ['--url', url, '--build', notchBuild()], { detached: true, stdio: 'ignore' }).unref();
      return true;
    }
    if (process.platform === 'win32') {
      spawn('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-WindowStyle', 'Hidden', '-File', PS1, '-Url', url, '-Build', notchBuild()],
        { detached: true, stdio: 'ignore', windowsHide: true }).unref();
      return true;
    }
  } catch (err) {
    logError(err);
  }
  return false;
}
