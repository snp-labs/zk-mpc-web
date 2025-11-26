import { z } from 'zod';

export const InitProtocolSchema = z.object({
  participantType: z.string().optional(), // Enum은 string으로 처리
  sid: z.string(),
  otherIds: z.array(z.string()),
  participantIds: z.array(z.string()),
  threshold: z.number(),
  messageBytes: z.any(),
  target: z.string().optional(),
});

export const ProceedRoundSchema = z.object({
  type: z.string(),
  sid: z.string(),
  message: z.string(),
});


export const StartProtocolSchema = z.object({
  type: z.string(),
  sid: z.string(),
});