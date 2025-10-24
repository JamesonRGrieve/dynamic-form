# Changelog

## [0.1.0] - 2025-10-24
### Added
- Comprehensive refactor of `DynamicForm` with deterministic validation, locale-aware labelling, and strict type definitions.
- Lightweight UI primitives that remove the dependency on external design systems while preserving accessibility.
- Utility helpers for timezone sorting, label formatting, and typed state management.
- Automated build, lint, and test scripts alongside a Vitest configuration.
- Developer documentation covering setup, releases, and testing philosophy.

### Fixed
- Boolean, numeric, and select field handling now preserves data integrity and avoids React state race conditions during submission.
- Validation errors no longer leak sensitive field values into logs and are announced via accessible alerts.

### Removed
- Hundreds of unused dependencies from the package manifest, reducing supply-chain risk and bundle weight.
