import { create } from 'zustand';

interface MPCState {
  userId: string;
  tshare: string;
  auxInfo: string;
  presign: string;
  setUserId: (id: string) => void;
  setTShare: (share: string) => void;
  setAuxInfo: (info: string) => void;
  setPresign: (presign: string) => void;
  resetMPCState: () => void;
}

export const useMPCStore = create<MPCState>((set) => ({
  userId: "",
  tshare: "",
  auxInfo: "",
  presign: "",
  setUserId: (id) => set({ userId: id }),
  setTShare: (share) => set({ tshare: share }),
  setAuxInfo: (info) => set({ auxInfo: info }),
  setPresign: (presign) => set({ presign: presign}),
  resetMPCState: () => set({ userId: "", tshare: "", auxInfo: "", presign: "" }),
}));
