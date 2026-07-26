#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "${script_dir}/.." && pwd)"
output_path="${1:-${repo_root}/files/Yildiz_HuseyinUgur_CV.pdf}"

if [[ "${output_path}" != /* ]]; then
  output_path="$(pwd)/${output_path}"
fi

command -v python3 >/dev/null 2>&1 || {
  echo "build_cv_pdf: python3 is required" >&2
  exit 1
}
command -v latexmk >/dev/null 2>&1 || {
  echo "build_cv_pdf: latexmk is required" >&2
  exit 1
}
python_cmd=(python3)
if ! python3 -c "import jinja2, yaml" >/dev/null 2>&1; then
  command -v uv >/dev/null 2>&1 || {
    echo "build_cv_pdf: install jinja2 and pyyaml, or install uv for an isolated run" >&2
    exit 1
  }
  python_cmd=(uv run --quiet --with jinja2 --with pyyaml python)
fi

build_dir="$(mktemp -d "${TMPDIR:-/tmp}/huguryildiz-cv.XXXXXX")"
cleanup() {
  rm -rf "${build_dir}"
}
trap cleanup EXIT

"${python_cmd[@]}" "${script_dir}/render_cv_tex.py" --out "${build_dir}/main.tex"
(
  cd "${build_dir}"
  latexmk -pdf -file-line-error -halt-on-error -interaction=nonstopmode main.tex
)

test -s "${build_dir}/main.pdf" || {
  echo "build_cv_pdf: generated PDF is missing or empty" >&2
  exit 1
}
mkdir -p "$(dirname "${output_path}")"
install -m 0644 "${build_dir}/main.pdf" "${output_path}"
echo "wrote ${output_path}"
