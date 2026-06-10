/**
 * Expo config plugin: work around `fmt` failing to compile under Xcode 26+'s
 * stricter C++20 `consteval` (React Native 0.76 pins fmt 11.0.2):
 *
 *   ios/Pods/fmt/include/fmt/format-inl.h: call to consteval function
 *   'fmt::basic_format_string<...>' is not a constant expression
 *
 * fmt/base.h selects `consteval` via an #if/#elif chain with no #ifndef guard,
 * so a `-DFMT_USE_CONSTEVAL=0` build setting just gets redefined back to 1 on
 * modern Apple clang (__cpp_consteval). Instead we patch the header in the
 * Podfile's post_install (which runs after pods are fetched) so FMT_CONSTEVAL
 * expands to nothing — the basic_format_string constructor becomes a normal
 * (non-consteval) function and compiles. The patch is re-applied on every
 * `pod install`, so it survives `expo prebuild`.
 *
 * CommonJS (.cjs) because package.json sets "type": "module".
 */
const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

const SNIPPET = `
    # --- fmt consteval workaround for Xcode 26+ clang (see withFmtConstevalFix.cjs) ---
    fmt_base = File.join(installer.sandbox.root, 'fmt', 'include', 'fmt', 'base.h')
    if File.exist?(fmt_base)
      fmt_text = File.read(fmt_base)
      fmt_patched = fmt_text.gsub('#  define FMT_CONSTEVAL consteval', '#  define FMT_CONSTEVAL /* consteval disabled for Xcode clang */')
      File.write(fmt_base, fmt_patched) if fmt_patched != fmt_text
    end
`;

module.exports = function withFmtConstevalFix(config) {
  return withDangerousMod(config, [
    "ios",
    (cfg) => {
      const podfile = path.join(cfg.modRequest.platformProjectRoot, "Podfile");
      let contents = fs.readFileSync(podfile, "utf8");
      if (!contents.includes("fmt consteval workaround")) {
        contents = contents.replace(
          /post_install do \|installer\|/,
          (m) => m + "\n" + SNIPPET
        );
        fs.writeFileSync(podfile, contents);
      }
      return cfg;
    },
  ]);
};
