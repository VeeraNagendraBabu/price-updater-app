# Real-Time Price Tracker

A lightweight application showcasing real-time price updates using React (TypeScript) and .NET with SignalR.

## Features

- **10 Sample Items** displaying:
  - Product name
  - Current price
  - Last updated timestamp
- **Real-Time Updates**:
  - Subscribe/unsubscribe functionality
  - Price updates every second
- **Visual Indicators**:
  - Green arrow (↑) for price increases
  - Red arrow (↓) for price decreases
  - Gray arrow (→) for no change
- **Efficient Communication**:
  - SignalR for real-time updates
  - Minimal data transfer

## Quick Start

### Backend (.NET)
1. Navigate to the backend directory
2. Run `dotnet run`
3. The server will start on `https://localhost:7078`

### Frontend (React)
1. Navigate to the frontend directory
2. Run `npm install`
3. Run `npm start`
4. The app will open in your browser at `http://localhost:3000`

## Technical Implementation
### Backend Structure
1. ItemsController.cs - REST endpoints for items
2. PriceHub.cs - SignalR hub for real-time updates
3. Program.cs - Main configuration with:
    - CORS setup
    - SignalR registration
    - HTTPS configuration

### Frontend Structure
1. App.tsx - Main component with:
2. SignalR connection management
3. Subscription logic
4. Price display table
5. App.css - Custom styles without external dependencies