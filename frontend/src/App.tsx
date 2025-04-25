import React, { useState, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';
import './App.css';
import Item from './models/Items';

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('Disconnected');
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [priceChanges, setPriceChanges] = useState<Record<string, 'up' | 'down' | 'same'>>({});

  // Load initial items
  useEffect(() => {
    const fetchInitialItems = async () => {
      try {
        const response = await fetch('https://localhost:7078/api/items');
        const data = await response.json();
        setItems(data);
        setLoading(false);
        
        // Initialize price changes tracking
        const initialChanges: Record<string, 'same'> = {};
        data.forEach((item: Item) => {
          initialChanges[item.id] = 'same';
        });
        setPriceChanges(initialChanges);
      } catch (err) {
        console.error('Failed to load initial items:', err);
        setLoading(false);
      }
    };

    fetchInitialItems();
  }, []);

  // Initialize SignalR connection
  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7078/api/pricehub", {
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets,
        withCredentials: true,
        logger: signalR.LogLevel.Debug
      })
      .configureLogging(signalR.LogLevel.Debug)
      .build();

    setConnection(newConnection);

    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, []);

  // Handle price change indicators
  const updatePriceChange = (newItems: Item[]) => {
    setItems(prevItems => {
      const changes: Record<string, 'up' | 'down' | 'same'> = {};
      
      newItems.forEach(newItem => {
        const oldItem = prevItems.find(item => item.id === newItem.id);
        if (!oldItem) {
          changes[newItem.id] = 'same';
          return;
        }

        if (newItem.price > oldItem.price) changes[newItem.id] = 'up';
        else if (newItem.price < oldItem.price) changes[newItem.id] = 'down';
        else changes[newItem.id] = 'same';
      });

      setPriceChanges(changes);
      return newItems;
    });
  };

  // Subscribe to price updates
  const subscribeToUpdates = async () => {
    if (!connection) return;

    try {
      await connection.invoke('SubscribeToPriceUpdates');
      setIsSubscribed(true);
      
      connection.on('ReceivePriceUpdates', (updatedItems: Item[]) => {
        updatePriceChange(updatedItems);
      });

      connection.on('ReceivePriceUpdate', (updatedItem: Item) => {
        updatePriceChange(items.map(item => 
          item.id === updatedItem.id ? updatedItem : item
        ));
      });

    } catch (err) {
      console.error('Subscription failed:', err);
    }
  };

  // Unsubscribe from price updates
  const unsubscribeFromUpdates = async () => {
    if (!connection) return;

    try {
      await connection.invoke('UnsubscribeFromPriceUpdates');
      setIsSubscribed(false);
      
      // Remove handlers but keep connection alive
      connection.off('ReceivePriceUpdates');
      connection.off('ReceivePriceUpdate');

    } catch (err) {
      console.error('Unsubscription failed:', err);
    }
  };

  // Start/stop connection
  useEffect(() => {
    if (!connection) return;

    const startConnection = async () => {
      try {
        setConnectionStatus('Connecting...');
        await connection.start();
        setConnectionStatus('Connected');
      } catch (err) {
        setConnectionStatus('Connection Failed');
        console.error('Connection error:', err);
        setTimeout(startConnection, 5000);
      }
    };

    startConnection();

    return () => {
      connection.off('ReceivePriceUpdates');
      connection.off('ReceivePriceUpdate');
    };
  }, [connection]);

  if (loading) {
    return <div className="loading">Loading initial items...</div>;
  }

  return (
    <div className="app">
      <h1>Price Updates</h1>
      
      <div className="connection-status">
      <span className={`status-indicator ${connectionStatus.toLowerCase()}`}></span>
      Status: {connectionStatus} | Subscription: {isSubscribed ? 'Active' : 'Inactive'}
      </div>

      <div className="buttons">
        <button 
          className="subscribe-btn"
          onClick={subscribeToUpdates}
          disabled={!connection || isSubscribed}
        >
          Subscribe to Updates
        </button>
        
        <button 
          className="unsubscribe-btn"
          onClick={unsubscribeFromUpdates}
          disabled={!connection || !isSubscribed}
        >
          Unsubscribe from Updates
        </button>
      </div>

      <div className="items-list">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Updated At</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>{new Date(item.updatedAt).toLocaleTimeString()}</td>
                <td className={`change-indicator ${priceChanges[item.id] || 'same'}`}>
                  {priceChanges[item.id] === 'up' ? '↑' : 
                   priceChanges[item.id] === 'down' ? '↓' : '→'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;