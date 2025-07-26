export interface Database {
  public: {
    Tables: {
      invites: {
        Row: {
          id: string;
          email: string;
          name: string;
          code: string;
          status: 'pending' | 'accepted' | 'expired';
          expires_at: string;
          created_by: string;
          created_at: string;
          accepted_at: string | null;
          user_id: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          code: string;
          status?: 'pending' | 'accepted' | 'expired';
          expires_at: string;
          created_by: string;
          created_at?: string;
          accepted_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          code?: string;
          status?: 'pending' | 'accepted' | 'expired';
          expires_at?: string;
          created_by?: string;
          created_at?: string;
          accepted_at?: string | null;
          user_id?: string | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export type InviteStatus = 'pending' | 'accepted' | 'expired';

export interface Invite {
  id: string;
  email: string;
  name: string;
  code: string;
  status: InviteStatus;
  expires_at: string;
  created_by: string;
  created_at: string;
  accepted_at: string | null;
  user_id: string | null;
}
