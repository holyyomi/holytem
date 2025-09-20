export type Json = | string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      [_in_progress: string]: {
        Row: Record<string, unknown>; // You might want to replace 'Record<string, unknown>' with a more specific type if you have a default table structure.
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
    };
    Views: {
      [_in_progress: string]: {
        Row: Record<string, unknown>;
      };
    };
    Functions: {
      [_in_progress: string]: {
        Args: Record<string, unknown>;
        Returns: Record<string, unknown>;
      };
    };
    Enums: {
      [_in_progress: string]: string;
    };
    CompositeTypes: {
      [_in_progress: string]: Record<string, unknown>;
    };
  };
};
