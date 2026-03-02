# Project History

## Latest Changes (2026-03-02)

### Build & Toolchain Fixes

#### Fixed MSVC Linker Conflict
- **Issue**: Rust build was using GNU `link.exe` from Git for Windows instead of MSVC linker
- **Root Cause**: Git for Windows (`C:\Program Files\Git\usr\bin\link.exe`) was in PATH before MSVC tools
- **Solution**: Created `.cargo/config.toml` to explicitly point to MSVC linker
  ```toml
  [target.x86_64-pc-windows-msvc]
  linker = "C:\\Program Files\\Microsoft Visual Studio\\2022\\Community\\VC\\Tools\\MSVC\\14.44.35207\\bin\\Hostx64\\x64\\link.exe"
  ```

#### Installed Missing Windows SDK
- **Issue**: Linker failed with `LNK1181: cannot open input file 'kernel32.lib'`
- **Root Cause**: Windows 10/11 SDK development libraries were not installed with Visual Studio
- **Solution**: Installed via Visual Studio Installer > Modify > Individual Components > Windows 11 SDK

### Dependency Updates

#### Synced Tauri Package Versions
- **Issue**: Version mismatch warning between Rust crates and NPM packages
  - `tauri` (Rust): 2.2.5 vs `@tauri-apps/api` (NPM): 2.10.1
  - `tauri-plugin-opener` (Rust): 2.2.5 vs `@tauri-apps/plugin-opener` (NPM): 2.5.3
- **Solution**: Ran `cargo update` which resolved latest compatible versions
  - `tauri`: 2.2.5 → 2.10.2 ✓
  - `tauri-plugin-opener`: 2.2.5 → 2.5.3 ✓
  - `tauri-build`: 2.0.5 → 2.5.5 ✓

### Tailwind CSS v4 Major Upgrade

#### Upgraded from v3.4.17 → v4.2.1

**Changes Made:**
1. Ran `npx @tailwindcss/upgrade` (automated migration tool)
2. Fixed CSS imports in `src/App.css`
   - Old: `@import 'tailwindcss/theme'`, `@import 'tailwindcss/components.css'`, etc.
   - New: `@import "tailwindcss"` (single import handles everything)
3. Updated `vite.config.ts`
   - Added `@tailwindcss/vite` plugin for better performance
   - Removed PostCSS-based processing
4. Updated `postcss.config.js`
   - Removed `tailwindcss` and `autoprefixer` (v4 handles this natively)
   - Left empty `plugins: {}`
5. Installed `@tailwindcss/vite` dependency

**Key v4 Features:**
- CSS-first configuration (legacy JS config still works)
- Modern browser targeting (Safari 16.4+, Chrome 111+, Firefox 128+)
- Native CSS variables via `@theme` directives
- Improved performance with Vite plugin

**Breaking Changes Checked:**
- ✓ No `bg-gradient-*` → `bg-linear-*` renames needed
- ✓ Shadow syntax compatible (`shadow-xs` already present, correct for v4)
- ✓ Opacity/ring modifiers compatible (using modern `/50` syntax)
- ✓ No deprecated transform prefix usage

**Build Status:**
- ✓ Production build: Passes (24.46 kB CSS output)
- ✓ Dev server: Starts cleanly
- ✓ Tests: All pass (1/1)

## Project Stack

- **Frontend**: React 18.3.1 + TypeScript
- **Build**: Vite 7.3.1
- **Styling**: Tailwind CSS 4.2.1 + shadcn/ui
- **Desktop Framework**: Tauri 2.10.2
- **Package Manager**: npm
- **Testing**: Vitest

## Known Issues

None currently.

## Next Steps

- Consider migrating `tailwind.config.js` to CSS-only format (future v4 releases may deprecate JS config)
- Monitor for any v4-specific plugin updates needed for Tailwind plugins used in the project
