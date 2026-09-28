# Quran Turn · notch host for Windows (experimental).
#
# Windows has no notch, so the reader drops from the top-centre of the screen
# like a curtain while your agent works and folds back up when the turn ends.
# It is the same page as on macOS (app/notch.html, served by the local
# quran-turn server), shown in a Microsoft Edge app window whose title bar and
# frame are removed. Nothing is installed: Edge ships with Windows 10/11 and
# PowerShell compiles the few Win32 calls below on the fly.
#
# The page posts open/close/height to the server; this script long-polls
# GET /api/surface and moves the window. Turn it on with:
#   quran-turn surface notch
param(
  [Parameter(Mandatory = $true)][string]$Url,
  [string]$Build = ''
)
$ErrorActionPreference = 'Stop'
if ($Url -notmatch '^http://127\.0\.0\.1:\d+/$') { exit 1 }

Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;
using System.Text;
public static class QtWin {
  public delegate bool EnumProc(IntPtr h, IntPtr l);
  [DllImport("user32.dll")] public static extern bool EnumWindows(EnumProc f, IntPtr l);
  [DllImport("user32.dll", CharSet = CharSet.Unicode)] public static extern int GetWindowText(IntPtr h, StringBuilder s, int n);
  [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr h);
  [DllImport("user32.dll", EntryPoint = "GetWindowLongPtrW")] public static extern IntPtr GetLong(IntPtr h, int i);
  [DllImport("user32.dll", EntryPoint = "SetWindowLongPtrW")] public static extern IntPtr SetLong(IntPtr h, int i, IntPtr v);
  [DllImport("user32.dll")] public static extern bool SetWindowPos(IntPtr h, IntPtr after, int x, int y, int w, int hh, uint f);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int cmd);
  [DllImport("user32.dll")] public static extern bool IsWindow(IntPtr h);
  [DllImport("user32.dll")] public static extern bool SetProcessDPIAware();
  [DllImport("user32.dll")] public static extern int GetSystemMetrics(int i);
  [DllImport("user32.dll")] public static extern uint GetDpiForWindow(IntPtr h);
  [DllImport("dwmapi.dll")] public static extern int DwmSetWindowAttribute(IntPtr h, int attr, ref int v, int size);

  public static IntPtr Find(string title) {
    IntPtr found = IntPtr.Zero;
    EnumWindows((h, l) => {
      var sb = new StringBuilder(256);
      GetWindowText(h, sb, 256);
      if (sb.ToString() == title) { found = h; return false; }
      return true;
    }, IntPtr.Zero);
    return found;
  }
}
'@
[void][QtWin]::SetProcessDPIAware()

$edge = @(
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $edge) { exit 1 }

# A separate Edge profile, so this window never mixes with your own browsing.
$profileDir = Join-Path $env:LOCALAPPDATA 'quran-turn\edge'
New-Item -ItemType Directory -Force -Path $profileDir | Out-Null
$page = "${Url}notch.html?host=win&nw=0&nh=34&build=$Build"
Start-Process -FilePath $edge -ArgumentList @("--app=$page", "--user-data-dir=$profileDir", '--window-size=460,240', '--window-position=-3000,-3000', '--no-first-run') | Out-Null

$title = 'Quran Turn notch'
$hwnd = [IntPtr]::Zero
for ($i = 0; $i -lt 100 -and $hwnd -eq [IntPtr]::Zero; $i++) { Start-Sleep -Milliseconds 150; $hwnd = [QtWin]::Find($title) }
if ($hwnd -eq [IntPtr]::Zero) { exit 1 }

# Frameless, always on top, out of the taskbar and Alt+Tab.
$GWL_STYLE = -16; $GWL_EXSTYLE = -20
$WS_CAPTION = 0x00C00000; $WS_THICKFRAME = 0x00040000; $WS_SYSMENU = 0x00080000; $WS_MINMAX = 0x00030000
$WS_EX_TOOLWINDOW = 0x00000080; $WS_EX_APPWINDOW = 0x00040000
$style = [QtWin]::GetLong($hwnd, $GWL_STYLE).ToInt64() -band (-bnot ($WS_CAPTION -bor $WS_THICKFRAME -bor $WS_SYSMENU -bor $WS_MINMAX))
[void][QtWin]::SetLong($hwnd, $GWL_STYLE, [IntPtr]$style)
$ex = ([QtWin]::GetLong($hwnd, $GWL_EXSTYLE).ToInt64() -bor $WS_EX_TOOLWINDOW) -band (-bnot $WS_EX_APPWINDOW)
[void][QtWin]::SetLong($hwnd, $GWL_EXSTYLE, [IntPtr]$ex)
$round = 2 # DWMWCP_ROUND (Windows 11; ignored on Windows 10)
[void][QtWin]::DwmSetWindowAttribute($hwnd, 33, [ref]$round, 4)

$TOPMOST = [IntPtr](-1)
$SWP = 0x0010 -bor 0x0020 -bor 0x0040 # NOACTIVATE | FRAMECHANGED | SHOWWINDOW
$scale = [Math]::Max(1.0, [QtWin]::GetDpiForWindow($hwnd) / 96.0)
$screenW = [QtWin]::GetSystemMetrics(0)
$width = [int](460 * $scale)
$chrome = 0      # the browser's own title strip, tucked above the screen edge
$height = 200    # the card, as the page reports it
$shown = 0.0     # how far the curtain is down, in pixels

function Place([double]$h) {
  $x = [int](($screenW - $width) / 2)
  $visible = [Math]::Max(1, [int]$h)
  [void][QtWin]::SetWindowPos($hwnd, $TOPMOST, $x, - $chrome, $width, $visible + $chrome, $SWP)
}

# Ease the curtain from where it is to `$to` pixels (0 = folded away).
function Curtain([double]$to, [int]$ms) {
  $from = $script:shown
  $sw = [Diagnostics.Stopwatch]::StartNew()
  if ($from -le 0 -and $to -gt 0) { [void][QtWin]::ShowWindow($hwnd, 4) } # SW_SHOWNOACTIVATE
  do {
    $t = [Math]::Min(1.0, $sw.ElapsedMilliseconds / $ms)
    $e = if ($to -gt $from) { 1 - [Math]::Pow(1 - $t, 3) } else { $t * $t * (3 - 2 * $t) }
    $script:shown = $from + ($to - $from) * $e
    Place $script:shown
    Start-Sleep -Milliseconds 8
  } while ($t -lt 1.0)
  if ($to -le 0) { [void][QtWin]::ShowWindow($hwnd, 0) } # SW_HIDE
}

[void][QtWin]::ShowWindow($hwnd, 0)
$seq = 0
$isOpen = $false
while ([QtWin]::IsWindow($hwnd)) {
  try {
    $s = Invoke-RestMethod -Uri "${Url}api/surface?since=$seq" -TimeoutSec 35
  } catch {
    Start-Sleep -Seconds 3
    try { Invoke-RestMethod -Uri "${Url}api/health" -TimeoutSec 3 | Out-Null } catch { break }
    continue
  }
  $seq = [int]$s.seq
  if ($s.quit) { break }
  $chrome = [int]([double]$s.chrome * $scale)
  if ([double]$s.height -gt 0) { $height = [double]$s.height * $scale }
  if ($s.open -and -not $isOpen) { $isOpen = $true; Curtain $height 420 }
  elseif (-not $s.open -and $isOpen) { $isOpen = $false; Curtain 0 320 }
  elseif ($isOpen -and [Math]::Abs($height - $shown) -ge 1) { Curtain $height 200 }
}

# Done: close our Edge window (only ours: it runs in its own profile).
Get-CimInstance Win32_Process -Filter "Name = 'msedge.exe'" |
  Where-Object { $_.CommandLine -like "*$profileDir*" } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
