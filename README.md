# Hüseyin Uğur Yıldız — Academic Website

Source repository for the personal academic website of **Hüseyin Uğur Yıldız**, Associate Professor of Electrical Engineering at [TED University](https://www.tedu.edu.tr/), Ankara, Türkiye, and IEEE Senior Member. The site is a static publication generated with [Jekyll](https://jekyllrb.com) and served through GitHub Pages; each push to `master` triggers an automated build and deployment.

The website presents the author's scholarly record and research program, which concerns mathematical optimization, wireless and underwater sensor networks, resilient drone-assisted aerial networks, and hybrid optimization–reinforcement-learning methods.

**Live site:** <https://huguryildiz.com>

## Contents of the site

| Section | Description |
| --- | --- |
| [Home](https://huguryildiz.com/) | Biographical summary, research interests, and recent news. |
| [Curriculum Vitae](https://huguryildiz.com/cv/) | Education, academic appointments, honours, and technical competencies. |
| [Publications](https://huguryildiz.com/publications/) | Journal articles, conference papers, and editorial contributions, with DOI links, full-text files, and interactive filtering. |
| [Research](https://huguryildiz.com/research/) | Overview of the research program — optimization, sensor networks, resilient aerial networks, hybrid optimization–RL — and associated software. |
| [Service](https://huguryildiz.com/service/) | Program-committee memberships, session chairing, peer review, and invited seminars. |
| [Students](https://huguryildiz.com/students/) | Supervised doctoral and master's theses. |
| [Teaching](https://huguryildiz.com/teaching/) | Undergraduate and graduate courses at TED University. |

## Associated software

Research artefacts developed in support of the program and documented on the [Research page](https://huguryildiz.com/research/):

- **[VERA](https://vera-eval.app)** — an evaluation platform for academic juries, capstone assessment, and accreditation workflows.
- **[KAIROS](https://github.com/huguryildiz/KAIROS)** — conflict-free university course timetabling built on OR-Tools CP-SAT.
- **[wsn-opt-python](https://github.com/huguryildiz/wsn-opt-python)** — an instructional network-flow optimization framework for wireless sensor networks.

## Building the site locally

The site may be served with Docker, which requires no local Ruby installation and combines `_config.yml` with `_config_docker.yml`:

```bash
docker compose up
```

Alternatively, using a native Ruby toolchain:

```bash
bundle install
bundle exec jekyll serve
```

Either command serves the site at `http://localhost:4000`. There is no automated test suite; the site is validated visually in the browser.

## Repository organization

| Path | Purpose |
| --- | --- |
| `_pages/` | Page content in Markdown. |
| `_layouts/`, `_includes/` | Layout templates and reusable partials that override the theme. |
| `_sass/`, `assets/` | Style overrides, compiled CSS, scripts, fonts, and icons. |
| `_data/` | Structured data — navigation, CV in JSON Resume format, and citation metrics. |
| `scripts/` | Maintenance utilities for CV synchronization and metric retrieval. |
| `index.md` | Home page. |
| `_config.yml` | Site configuration. |

The presentation is based on the [AcademicPages](https://github.com/academicpages/academicpages.github.io) theme — a derivative of [Minimal Mistakes](https://mademistakes.com/work/minimal-mistakes-jekyll-theme/) — pinned to `mmistakes/minimal-mistakes@4.24.0`. Local files under `_includes/`, `_layouts/`, and `_sass/` take precedence over their theme counterparts; the vendored theme is not modified directly. Citation and h-index statistics under `_data/` are refreshed monthly by a scheduled GitHub Actions workflow that queries the [OpenAlex API](https://openalex.org).

## Contact

- ORCID: [0000-0002-1556-2634](https://orcid.org/0000-0002-1556-2634)
- Google Scholar: <https://scholar.google.com/citations?user=nQwHS1gAAAAJ>
- LinkedIn: <https://www.linkedin.com/in/huguryildiz>

## License

Released under the MIT License. © 2026 Hüseyin Uğur Yıldız.
