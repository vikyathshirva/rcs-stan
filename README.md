# Race Condition Simulator (RCS)


## Overview

The Race Condition Simulator (RCS) is a project that simulates a race condition scenario using Redis as a data store. The simulation involves two processes, P1 and P2, incrementing a counter while managing a lock through coordination using Redis and RabbitMQ.

## Prerequisites

- Node.js
- Docker

## Installation

1. change permission for docker-setup.sh:

   ```bash
   chmod +x docker-setup.sh


2. run docker-setup.sh:

   ```bash
   ./docker-setup.sh

3. run without co-ordination:

   ```bash
   npm run start-without-coordinate
4. run with co-ordination:

   ```bash
   npm run start-with-coordinate

5. run with cli:

   ```bash
   node cli.js

## Files and Directories

- **index.js:** Main entry point for the simulation.
- **process2.js:** Simulates the second process (P2).
- **cli.js:** CLI interface for running the simulation.
- **utils/:** Directory containing initialization scripts for Redis and RabbitMQ.
- **docker-compose.yml:** Docker Compose configuration for Redis, RabbitMQ, and the Node.js application.

## Simulation Details

<img width="1179" alt="Screenshot 2024-03-12 at 7 23 29 AM" src="https://github.com/vikyathshirva/rcs-stan/assets/49819519/7e4c71a1-30ac-45b4-b0eb-bf196c781d63">


### Processes:

- **Process1:** Increments the counter with even values.
- **Process2:** Increments the counter with odd values.

### Coordination:

- Achieved through Redis and RabbitMQ.
- Processes wait for a lock in Redis before performing updates, ensuring proper synchronization.

### Queue:

- A Redis list (counterQueue) is used as a queue to store updates.
- Both processes push updates to the queue, and the main process pops updates for processing.

## Simulation Output

The console displays the current state of the queue and processing updates. Ensure that Redis and RabbitMQ are running before starting the simulation.

## Exiting the Simulation

Press `Ctrl + C` to exit. Re-run the CLI interface to restart the simulation or choose to exit.

