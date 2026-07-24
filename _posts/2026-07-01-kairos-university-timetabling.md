---
title: "A university timetable can look clean on paper and still break in operation"
date: 2026-07-01
excerpt: "KAIROS is a CP-SAT university timetabling engine that drove every hard-constraint category to zero across two live TED University terms — cutting within-day idle time ~75% and capacity waste ~29% per room-hour."
tags: [Operations Research, Constraint Programming, University Timetabling]
linkedin: "https://www.linkedin.com/posts/huguryildiz_kairos-zero-conflict-university-timetabling-activity-7477983095242211329-2Zcz"
---

One instructor booked in two rooms. One lab section with no valid slot. By week three, the schedule isn't a plan anymore; it's exception management.

This is why timetabling isn't a spreadsheet task. It's a **constrained optimization problem** — hundreds of sections and thousands of interacting rules, where one wrong placement quietly breaks ten others.

**KAIROS** is a university timetabling engine built on Google OR-Tools CP-SAT. It turns raw course, room, faculty, and policy data into a schedule that is **feasible by construction**, and independently verified.

## How it works — five stages

- **Prune** hard rules up front, so illegal placements never exist
- **Construct** a feasible schedule, block by block
- **Repair** with CP-SAT until every block is placed
- **Polish** with Great Deluge — never at the cost of a hard constraint
- **Validate** every assignment independently

A full university term solves in **3–10 minutes**, depending on the quality target.

## Results — two live terms

Tested on two live TED University terms (Fall 2025 and Spring 2026), KAIROS drove **every tracked hard-constraint category to zero** unresolved violations in both semesters. Within-day idle time dropped ~**75%** and capacity waste ~**29%** per room-hour, while occupancy and evening load stayed stable.

<div class="carousel" role="group" aria-label="KAIROS case study — swipeable slides">
  <img src="/assets/images/writing/kairos/slide-1.png" alt="Every hard conflict eliminated — Fall 2025: 854 to 0, Spring 2026: 808 to 0" loading="lazy">
  <img src="/assets/images/writing/kairos/slide-2.png" alt="How KAIROS works — five-stage workflow" loading="lazy">
  <img src="/assets/images/writing/kairos/slide-3.png" alt="Product UI — bilingual TR/EN scheduling web app" loading="lazy">
  <img src="/assets/images/writing/kairos/slide-4.png" alt="Benchmark results — feasibility heatmaps and quality KPIs for both terms" loading="lazy">
  <img src="/assets/images/writing/kairos/slide-5.png" alt="Deployed and auditable — built on Python, Streamlit, OR-Tools, CP-SAT, Great Deluge, Docker" loading="lazy">
</div>
<p class="carousel-hint">Swipe / scroll for the workflow, feasibility heatmaps, and term-by-term KPIs →</p>

Scheduling that is transparent, reproducible, and operationally reliable.

Explore the system end-to-end:

- [Try the live app →](https://kairos.huguryildiz.com)
- [Read the code →](https://github.com/huguryildiz/KAIROS)

For those who've run timetabling at scale: once feasibility is solved, which objective comes next — idle time, room use, or instructor workload balance?
