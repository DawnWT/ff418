import { type FILES_NAME } from '../ressources/files.js'

export interface FileProps {
  Name: string
  Key: string
  oldEncrypt: boolean
}

export interface RequestProps {
  Name: string
  Url: string
  EncodeKey: string
  RequestID: string
}

export interface MstItem {
  a4hXTIm0: FILES_NAME
  D0f6Cn7Q?: string
  dT2gJ1vH?: string
  wM9AfX6I: string
}

export type ServerVersion = 'GL' | 'JP'
