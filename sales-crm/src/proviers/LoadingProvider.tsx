import React, {useState, ReactNode } from 'react';
import { LoadingContext , LoadingOverlay} from '../contexts/LoadingContext';
export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('Loading...');
  
    const showLoading = (msg: string = 'Loading...') => {
      setMessage(msg);
      setIsLoading(true);
    };
  
    const hideLoading = () => {
      setIsLoading(false);
    };
  
    return (
      <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading, message }}>
        {children}
        {isLoading && <LoadingOverlay message={message} />}
      </LoadingContext.Provider>
    );
  };