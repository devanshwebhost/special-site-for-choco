// utils/tracker.js
export const saveProgress = (stage) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('valentine_stage', stage);
  }
};

export const getProgress = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('valentine_stage') || 'welcome';
  }
  return 'welcome';
};

export const logActivity = (action, details) => {
  if (typeof window !== 'undefined') {
    const currentLogs = JSON.parse(localStorage.getItem('valentine_logs') || '[]');
    const newLog = {
      timestamp: new Date().toISOString(),
      action: action,
      details: details,
      page: window.location.pathname
    };
    currentLogs.push(newLog);
    localStorage.setItem('valentine_logs', JSON.stringify(currentLogs));
  }
};

export const sendDataToEmail = async () => {
  if (typeof window !== 'undefined') {
    const logs = JSON.parse(localStorage.getItem('valentine_logs') || '[]');
    // Replace with your Google Apps Script Web App URL
    const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwQ5BxJ_47KPdRSvNCstcFxWYva8Tl9mz9G2Olm2zfc2CdwtmVGqMYnpFgDpqIfm47qEg/exec"; 
    
    try {
      await fetch(WEB_APP_URL, {
        method: "POST",
        body: JSON.stringify({ logs }),
        mode: "no-cors" // Important for Google Apps Script
      });
      console.log("Data sent to email");
    } catch (e) {
      console.error("Error sending email", e);
    }
  }
};