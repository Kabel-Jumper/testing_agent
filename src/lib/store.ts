'use client';

import { Item, Claim, UserProfile, CampusZone, ItemStatus } from '@/types';
import { INITIAL_ITEMS } from './mockData';

const ITEMS_STORAGE_KEY = 'titik_temu_uin_items_v2';
const CLAIMS_STORAGE_KEY = 'titik_temu_uin_claims_v2';
const USER_STORAGE_KEY = 'titik_temu_uin_user_v2';

export const DEMO_USER: UserProfile = {
  id: 'user-fauzan',
  full_name: 'Ahmad Fauzan',
  email: 'ahmad.fauzan@uin-antasari.ac.id',
  nim_or_nip: '210101030145',
  faculty_or_unit: 'Fakultas Tarbiyah & Keguruan',
  role: 'Mahasiswa',
  phone_number: '081255890123',
  avatar_url:
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  campus_zone: 'Gedung Kuliah / Fakultas',
};

const isBrowser = () => typeof window !== 'undefined';

export function getStoredItems(): Item[] {
  if (!isBrowser()) return INITIAL_ITEMS;
  try {
    const raw = localStorage.getItem(ITEMS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(INITIAL_ITEMS));
      return INITIAL_ITEMS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_ITEMS;
  } catch (err) {
    console.error('Failed to read items from localStorage:', err);
    return INITIAL_ITEMS;
  }
}

export function saveItems(items: Item[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('titik-temu-items-updated'));
  } catch (err) {
    console.error('Failed to save items to localStorage:', err);
  }
}

export function getItemById(id: string): Item | undefined {
  const items = getStoredItems();
  return items.find((it) => it.id === id);
}

export function createItem(
  data: Omit<Item, 'id' | 'created_at' | 'status'>
): Item {
  const items = getStoredItems();
  const newItem: Item = {
    ...data,
    id: `uin-item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    status: 'aktif',
    created_at: new Date().toISOString(),
  };

  const updated = [newItem, ...items];
  saveItems(updated);
  return newItem;
}

export function updateItemStatus(id: string, newStatus: ItemStatus): boolean {
  const items = getStoredItems();
  const index = items.findIndex((it) => it.id === id);
  if (index === -1) return false;

  items[index] = {
    ...items[index],
    status: newStatus,
  };

  saveItems(items);
  return true;
}

export function getStoredClaims(): Claim[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(CLAIMS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function submitClaim(
  data: Omit<Claim, 'id' | 'created_at' | 'status'>
): Claim {
  const claims = getStoredClaims();
  const newClaim: Claim = {
    ...data,
    id: `uin-claim-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    status: 'menunggu',
    created_at: new Date().toISOString(),
  };

  if (isBrowser()) {
    localStorage.setItem(CLAIMS_STORAGE_KEY, JSON.stringify([newClaim, ...claims]));
    window.dispatchEvent(new CustomEvent('titik-temu-claims-updated'));
  }
  return newClaim;
}

export function getClaimsByItemId(itemId: string): Claim[] {
  const claims = getStoredClaims();
  return claims.filter((c) => c.item_id === itemId);
}

export function getCurrentUser(): UserProfile | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: UserProfile | null): void {
  if (!isBrowser()) return;
  if (!user) {
    localStorage.removeItem(USER_STORAGE_KEY);
  } else {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }
  window.dispatchEvent(new CustomEvent('titik-temu-user-updated'));
}

export function resetToDefaultData(): void {
  if (!isBrowser()) return;
  localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(INITIAL_ITEMS));
  localStorage.removeItem(CLAIMS_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('titik-temu-items-updated'));
}
