#!/bin/sh
# Lints, composes, screenshots and audits the demo's frames from a terminal,
# using the Design engine of the Zeros checkout that ZEROS_REPO names.
#
#   ZEROS_REPO=/path/to/Zeros tools/audit.sh [frame-regex]
#
# The regex matches frame paths inside the Design folder, such as issues/ or
# tokens/colors. Results go to tools/out/, which Git ignores: lint.json,
# styles.json, audit.json and one PNG per frame and theme in shots/.
set -eu
: "${ZEROS_REPO:?Set ZEROS_REPO to a Zeros checkout with its dependencies installed (pnpm install).}"
tools=$(cd "$(dirname "$0")" && pwd)
repo=$(dirname "$tools")
out="$tools/out"
# Under Bun, the engine's Sass host needs a Node binary (engine/design/sass-process.ts).
ZEROS_PTY_HOST_RUNTIME=${ZEROS_PTY_HOST_RUNTIME:-$(command -v node)}
export ZEROS_PTY_HOST_RUNTIME ZEROS_REPO
rm -rf "$out"
mkdir -p "$out"
# Bun runs from the checkout so the engine resolves its own configuration and packages.
(cd "$ZEROS_REPO" && bun "$tools/check.ts" "$repo" "$out" ${1:+"$1"})
echo
node "$tools/shoot.mjs" "$out" ${1:+"$1"}
