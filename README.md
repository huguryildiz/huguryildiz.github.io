<div align="center">

<img src="assets/images/favicon/favicon.svg" width="132" height="132" alt="Hüseyin Uğur Yıldız monogram">

# Hüseyin Uğur Yıldız

**Associate Professor of Electrical and Electronics Engineering**<br>
TED University · Ankara, Türkiye

Operations research, mathematical optimization, and intelligent networked systems

<p>
  <a href="https://huguryildiz.com">Academic website</a> ·
  <a href="https://huguryildiz.com/research/">Research</a> ·
  <a href="https://huguryildiz.com/publications/">Publications</a> ·
  <a href="https://huguryildiz.com/cv/">Curriculum vitae</a>
</p>

<p>
  <a href="https://orcid.org/0000-0002-1556-2634">ORCID</a> ·
  <a href="https://scholar.google.com/citations?user=nQwHS1gAAAAJ">Google Scholar</a> ·
  <a href="https://www.linkedin.com/in/huguryildiz/">LinkedIn</a>
</p>

[![Live academic website](https://img.shields.io/badge/huguryildiz.com-live-12314E?style=flat-square&logo=googlechrome&logoColor=white)](https://huguryildiz.com) [![Deploy Jekyll site to Pages](https://github.com/huguryildiz/huguryildiz.github.io/actions/workflows/jekyll.yml/badge.svg?branch=master)](https://github.com/huguryildiz/huguryildiz.github.io/actions/workflows/jekyll.yml)

</div>

---

## Academic profile

I study how complex networked systems can be designed, optimized, and operated under
constraints on energy, reliability, connectivity, mobility, and uncertainty. My work
combines operations research and mathematical optimization with learning-based methods
when scale or changing conditions require adaptive decision-making.

The research programme spans wireless ad hoc networks, underwater acoustic sensor
networks, drone-assisted aerial networks, and emerging hybrid classical–quantum routing
paradigms. Across these settings, the common objective is to make system-level trade-offs
explicit and to develop models, algorithms, and software that remain interpretable and
verifiable.

This repository is the source for [huguryildiz.com](https://huguryildiz.com), a public
scholarly record containing publications, research directions, teaching, supervision,
professional service, research notes, and a web-and-PDF curriculum vitae.

## Research programme

| Direction | Central questions and methods |
| --- | --- |
| **Network optimization** | Linear, integer, and mixed-integer programming; network-flow formulations; goal programming; routing and resource allocation. |
| **Wireless and underwater networks** | Network lifetime, energy efficiency, k-connectivity, topology control, multi-sink architectures, void-region mitigation, and resilience under harsh operating conditions. |
| **Drone-assisted aerial networks** | Mobility-aware connectivity restoration, minimum-movement strategies, topology adaptation, and exact or heuristic optimization for resilient deployments. |
| **Hybrid optimization and learning** | Integration of mathematical optimization with reinforcement learning and neural parameter prediction for dynamic, large-scale network control. |
| **Emerging network paradigms** | Early-stage investigation of hybrid classical–quantum routing, including the effects of physical constraints such as entanglement lifetime and reliability. |

The full research map, representative publications, and scope notes are available on the
[Research](https://huguryildiz.com/research/) page.

## Selected public work

| Project | Description |
| --- | --- |
| [VERA](https://github.com/huguryildiz/VERA) | A platform for academic juries, capstone evaluation, rubric-based scoring, analytics, and accreditation-oriented reporting. [Web application](https://vera-eval.app/) |
| [KAIROS](https://github.com/huguryildiz/KAIROS) | An OR-Tools CP-SAT university course-timetabling system with repair search, independent post-solve validation, and structured schedule exports. [Web application](https://kairos.huguryildiz.com) |
| [Underwater Acoustic Ray Bench](https://github.com/huguryildiz/uwa-ray-bench) | A benchmark comparing language-model-generated underwater acoustic ray-tracing outputs with a three-dimensional BELLHOP3D reference solver. [Project site](https://uwa-ray-bench.vercel.app/) |
| [research-graph](https://github.com/huguryildiz/research-graph) | A Python verifier for multi-agent research workflows, with schema validation, provenance-chain checks, producer–reviewer role separation, and bounded revisions. |
| [IEEE / ACM Paper Writing Skills](https://github.com/huguryildiz/ieee-acm-paper-writing) | An evidence-aware workflow for drafting, rewriting, and auditing engineering manuscripts while preserving claim boundaries. |
| [wsn-opt-python](https://github.com/huguryildiz/wsn-opt-python) | A hands-on Python resource for network-flow-based optimization models in wireless sensor networks. |

## Scholarly snapshot

The following figures are a dated **Google Scholar snapshot**, stored in
[`_data/scholar_metrics.json`](_data/scholar_metrics.json) and refreshed independently
of the site source. They are not manually inferred or presented as permanent values.

| Works | Citations | h-index | i10-index | Snapshot date |
| ---: | ---: | ---: | ---: | --- |
| 45 | 1,047 | 16 | 24 | 3 August 2026 |

For publication metadata, DOI links, full-text availability, and year/type filters, see
the [publication catalogue](https://huguryildiz.com/publications/). Bibliometric sources
may legitimately disagree; the figures above are identified specifically as Google
Scholar values.

## Repository architecture

The site uses a single custom presentation path rather than a third-party theme:

```text
Page or post
    → _layouts/academic.html
    → _layouts/compress.html
    → assets/css/redesign.css
    → GitHub Pages
```

| Path | Responsibility |
| --- | --- |
| `index.md` | Home-page content, profile, research framing, news, and the interactive ocean digital twin |
| `_pages/` and `_posts/` | Academic pages and dated writing entries |
| `_layouts/academic.html` | Navigation, page shell, footer, theme control, and shared interactions |
| `assets/css/redesign.css` | Site-wide visual system and responsive presentation |
| `_data/cv.yml` | Source for the web CV, service and teaching records, and the generated CV PDF |
| `_data/publications.yml` | Source for publication records and the publication list in the CV PDF |
| `_includes/research-map.html` | Interactive research map driven by `_data/research_map.yml` |
| `scripts/` | Maintenance utilities for bibliometric snapshots, site-reach data, and CV generation |
| `.github/workflows/` | GitHub Pages deployment and scheduled snapshot workflows |
| `PRODUCT.md` | Design, accessibility, semantic-status, and data-honesty contract for the ocean digital twin |

The production branch is `master`, and the custom domain is declared in [`CNAME`](CNAME).
Generated output under `_site/` is a build artifact and is not edited directly.

## Reproducible development

Docker provides the most reproducible local environment:

```bash
docker compose up --build
```

The site is then available at <http://localhost:4000>. With a compatible native Ruby
installation, the equivalent workflow is:

```bash
bundle install
bundle exec jekyll serve
```

For a production-style build:

```bash
JEKYLL_ENV=production bundle exec jekyll build
```

The downloadable CV is generated from `_data/cv.yml`, `_data/publications.yml`, and the
LaTeX template. Refresh the local preview with:

```bash
scripts/build_cv_pdf.sh
```

Do not edit generated PDFs or `_site/` directly. Bibliometric and site-reach snapshots are
maintained by their dedicated scripts and workflows; secrets belong only in the local
environment or repository secrets, never in committed data or client-side code.

## Scholarly provenance and scope

- Publication, teaching, supervision, and service records are maintained as public academic
  records and should be changed only against verifiable source evidence.
- The web CV and downloadable CV use the same underlying CV and publication data, subject to
  their documented presentation differences.
- Google Scholar and OpenAlex are separate bibliometric sources; neither should be presented
  under the other's name.
- The public site-reach report presents aggregated GoatCounter data and does not infer
  visitors, sessions, bounce rate, or engagement measures unavailable from the source API.
- The repository is a personal scholarly record and a site implementation, not a generic
  Jekyll theme or a claim of general-purpose software capability.

## Licensing

Code and scholarly content are licensed separately; see [`LICENSE`](LICENSE) for the exact
scope.

- **Software** — MIT License.
- **Written content and media** — CC BY-NC 4.0, with attribution and non-commercial use
  requirements.
- **Publication PDFs under `files/`** — excluded from both licenses; publisher copyright and
  applicable self-archiving terms control.

For correspondence, the academic website is the canonical contact point:
[huguryildiz.com](https://huguryildiz.com).
