export interface ApiPagination {
  total_records: number;
  next_page: number;
  current_page: number;
  prev_page: number;
  total_pages: number;
}

export interface ApiMessage {
  message: string;
}
