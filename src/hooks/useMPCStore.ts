import { create } from 'zustand';

interface MPCState {
  userId: string;
  tshare: string;
  auxInfo: string;
  presign: string;
  address: string;
  pk: string;
  setUserId: (id: string) => void;
  setTShare: (share: string) => void;
  setAuxInfo: (info: string) => void;
  setPresign: (presign: string) => void;
  setAddress: (address: string) => void;
  setPk: (pk: string) => void;
  resetMPCState: () => void;
}

export const useMPCStore = create<MPCState>((set) => ({
  userId: "",
  tshare: "",
  auxInfo: "",
  presign: "",
  address: "",
  pk: "",
  setUserId: (id) => set({ userId: id }),
  setTShare: (share) => set({ tshare: share }),
  setAuxInfo: (info) => set({ auxInfo: info }),
  setPresign: (presign) => set({ presign: presign}),
  setAddress: (address) => set({address: address}),
  setPk: (pk) => set({ pk : pk}),
  resetMPCState: () => set({ userId: "", tshare: "", auxInfo: "", presign: "", address: "" }),
}));
