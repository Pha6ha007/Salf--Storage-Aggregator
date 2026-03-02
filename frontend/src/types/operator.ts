export interface Operator {
  id: string;
  user_id: string;
  company_name: string;
  company_registration?: string;
  tax_registration?: string;
  contact_person: string;
  contact_phone: string;
  contact_email: string;
  created_at: string;
  updated_at: string;
}

export interface OperatorSettings {
  id: string;
  operator_id: string;
  notifications_email: boolean;
  notifications_sms: boolean;
  notifications_whatsapp: boolean;
  auto_confirm_bookings: boolean;
  booking_buffer_hours: number;
  created_at: string;
  updated_at: string;
}

export interface OperatorStats {
  total_warehouses: number;
  active_warehouses: number;
  total_boxes: number;
  occupied_boxes: number;
  total_bookings: number;
  pending_bookings: number;
  active_bookings: number;
  total_revenue: number;
  monthly_revenue: number;
}

export interface UpdateOperatorDto {
  company_name?: string;
  company_registration?: string;
  tax_registration?: string;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
}

export interface UpdateOperatorSettingsDto {
  notifications_email?: boolean;
  notifications_sms?: boolean;
  notifications_whatsapp?: boolean;
  auto_confirm_bookings?: boolean;
  booking_buffer_hours?: number;
}
