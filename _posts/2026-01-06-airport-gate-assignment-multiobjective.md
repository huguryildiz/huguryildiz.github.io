---
title: "Airport gate assignment, revisited as a multi-objective mixed-integer program"
date: 2026-01-06
description: "A mixed-integer airport gate assignment model balances remote-stand penalties and passenger loads under time-overlap and gate-capacity constraints."
excerpt: "A mixed-integer formulation of the airport gate assignment problem: time-overlap constraints via slot discretization, passenger-based gate capacities derived from historic utilization, and an objective that trades remote-stand penalties against passenger load balance."
tags: [Operations Research, Multi-Objective Optimization, Integer Programming]
linkedin: "https://www.linkedin.com/posts/huguryildiz_multiobjectiveoptimization-operationsresearch-activity-7414284495715037185-1emD"
image: /assets/images/writing/covers/airport-gate-assignment-multiobjective.jpg
---

I revisited the **Airport Gate Assignment Problem (GAP)** from a **multi-objective optimization** perspective.

The problem is formulated as a **mixed-integer program**. Time-overlap conflicts are handled by discretizing the day into slots, so that at most one flight occupies a gate in any slot. Passenger-based gate capacity limits are derived from historic utilization patterns rather than assumed, and capacity is normalized to prevent a few gates from monopolizing traffic.

The objective combines two competing terms:

- a **penalty on remote (coached) gate assignments**, weighted by hour of day so that peak-hour coaching costs more;
- a **load-balancing term** that keeps passenger flows distributed evenly across gates, expressed as the normalized spread between the most and least loaded gate.

Decision variables assign each flight to a gate in one of two modes — contact gate or remote stand — and auxiliary variables track per-gate passenger load and its extremes. Model input is one day of departures (boarding and departure times, passenger counts, wingspans) plus a historic gate-allocation sheet used both to derive capacities and to benchmark the optimized solution against observed practice.

## What the solution looks like

On a 200-flight day across 41 gates, the load-balancing term flattens the passenger distribution almost completely: every gate ends up carrying between 640 and 661 passengers — a 21-passenger spread on a 26,635-passenger total.

<figure class="post-figure">
  <img src="/assets/images/writing/gap/optimized_total_pax_by_gate.png" alt="Bar chart titled Optimized Total Passengers by Gate: 41 bars, one per gate (1–30 and 90–100), all reaching essentially the same height just above 0.64 thousand passengers, showing a near-flat passenger distribution across gates" loading="lazy">
  <figcaption>Optimized passenger load per gate — bars are visually indistinguishable, which is exactly the intended effect of the load-balancing term.</figcaption>
</figure>

The remote-stand penalty, meanwhile, is driven to zero: all 200 flights are assigned to contact gates, against a 17.4% coached share in the historic baseline. The gate timeline shows how the slot-discretized overlap constraints pack boarding windows without collision, spreading occupancy across the full operating day rather than crowding the morning and evening peaks onto a few gates.

<figure class="post-figure">
  <img src="/assets/images/writing/gap/optimized_gate_timeline.webp" alt="Gantt-style timeline titled Optimized Gate Timeline (Boarding–Departure): horizontal colored bars for each flight's boarding window, stacked by gate on the vertical axis (gates 1–30 and 90–100) against a 04:00–24:00 time axis, with no overlapping bars on any single gate row" loading="lazy">
  <figcaption>Boarding-to-departure occupancy per gate. No two bars overlap on a row — the time-compatibility constraint holding across all 41 gates.</figcaption>
</figure>

Repository: [huguryildiz/airport-gate-assignment-optimization](https://github.com/huguryildiz/airport-gate-assignment-optimization)
