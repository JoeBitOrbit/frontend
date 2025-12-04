// Safe storage wrapper to avoid errors in restricted contexts (iframes, privacy mode, static sites)
// Falls back to in-memory map if localStorage is not accessible.
const memoryStore = new Map();

function canUse(){
  try{
    if(typeof window === 'undefined' || !('localStorage' in window)) return false;
    const testKey = '__stor_test__';
    try {
      window.localStorage.setItem(testKey,'1');
      window.localStorage.removeItem(testKey);
      return true;
    } catch(e) {
      console.debug('localStorage not available, using memory store');
      return false;
    }
  }catch(e){
    console.debug('canUse check failed, using memory store');
    return false;
  }
}

const enabled = canUse();

export function getItem(key){
  if(!key) return null;
  try {
    if(enabled){
      const val = window.localStorage.getItem(key);
      return val || null;
    }
  } catch(e) {
    // Silently ignore storage errors on restricted contexts
  }
  return memoryStore.get(key) || null;
}

export function setItem(key, val){
  if(!key) return;
  try {
    if(enabled){
      window.localStorage.setItem(key, val);
      return;
    }
  } catch(e) {
    // Silently ignore storage errors on restricted contexts
  }
  memoryStore.set(key, val);
}

export function removeItem(key){
  if(!key) return;
  try {
    if(enabled){
      window.localStorage.removeItem(key);
    }
  } catch(e) {
    // Silently ignore storage errors on restricted contexts
  }
  memoryStore.delete(key);
}

export function isPersistent(){ return enabled; }

export default { getItem, setItem, removeItem, isPersistent };