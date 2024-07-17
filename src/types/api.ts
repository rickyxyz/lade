export interface ApiPagination {
  total_records: number;
  next_page: number | null;
  current_page: number;
  prev_page: number | null;
  total_pages: number;
}

export interface ApiMessage {
  message: string;
}
