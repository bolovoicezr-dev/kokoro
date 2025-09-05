import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  minutesRemaining: number;
  totalMinutesPurchased: number;
  minutesUsed: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
  updateUserMinutes: (userId: string, minutesUsed: number) => void;
  addMinutesToUser: (userId: string, minutesToAdd: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo (in production, this would be handled by Supabase)
const mockUsers = [
  {
    id: '1',
    email: 'admin@kokoro.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin' as const,
    minutesRemaining: 999999, // Unlimited for admin
    totalMinutesPurchased: 999999,
    minutesUsed: 0,
  },
  {
    id: '2',
    email: 'user@example.com',
    password: 'user123',
    name: 'Regular User',
    role: 'user' as const,
    minutesRemaining: 2,
    totalMinutesPurchased: 2,
    minutesUsed: 0,
  },
  {
    id: '3',
    email: 'tafser.yeamin.tiu@gmail.com',
    password: '77Graminphone',
    name: 'Admin (Tafser Yeamin)',
    role: 'admin' as const,
    minutesRemaining: 999999, // Unlimited for admin
    totalMinutesPurchased: 999999,
    minutesUsed: 0,
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('kokoroUser');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      const isAdminEmail = typeof parsed?.email === 'string' && parsed.email.toLowerCase() === 'tafser.yeamin.tiu@gmail.com';
      const normalizedUser = {
        ...parsed,
        role: isAdminEmail ? 'admin' : parsed.role,
      };
      setUser(normalizedUser);
      // Persist normalized role if it changed
      localStorage.setItem('kokoroUser', JSON.stringify(normalizedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const isAdminEmail = foundUser.email.toLowerCase() === 'tafser.yeamin.tiu@gmail.com';
      const userData = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: (isAdminEmail ? 'admin' : foundUser.role) as 'admin' | 'user',
      };
      setUser(userData);
      localStorage.setItem('kokoroUser', JSON.stringify(userData));
      setLoading(false);
      return { success: true };
    } else {
      setLoading(false);
      return { success: false, error: 'Invalid email or password' };
    }
  };

  const register = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      setLoading(false);
      return { success: false, error: 'User already exists' };
    }
    
    // Create new user
    const isAdminEmail = email.toLowerCase() === 'tafser.yeamin.tiu@gmail.com';
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
      role: (isAdminEmail ? 'admin' : 'user') as const,
      minutesRemaining: isAdminEmail ? 999999 : 2,
      totalMinutesPurchased: isAdminEmail ? 999999 : 2,
      minutesUsed: 0,
    };
    
    mockUsers.push(newUser);
    
    const userData = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    };
    
    setUser(userData);
    localStorage.setItem('kokoroUser', JSON.stringify(userData));
    setLoading(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kokoroUser');
  };

  const updateUserMinutes = (userId: string, minutesUsed: number) => {
    if (user && user.id === userId) {
      const updatedUser = {
        ...user,
        minutesUsed: user.minutesUsed + minutesUsed,
        minutesRemaining: Math.max(0, user.minutesRemaining - minutesUsed)
      };
      setUser(updatedUser);
      localStorage.setItem('kokoroUser', JSON.stringify(updatedUser));
      
      // Update in mockUsers array
      const userIndex = mockUsers.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...updatedUser };
      }
    }
  };

  const addMinutesToUser = (userId: string, minutesToAdd: number) => {
    if (user && user.id === userId) {
      const updatedUser = {
        ...user,
        minutesRemaining: user.minutesRemaining + minutesToAdd,
        totalMinutesPurchased: user.totalMinutesPurchased + minutesToAdd
      };
      setUser(updatedUser);
      localStorage.setItem('kokoroUser', JSON.stringify(updatedUser));
      
      // Update in mockUsers array
      const userIndex = mockUsers.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...updatedUser };
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateUserMinutes, addMinutesToUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}