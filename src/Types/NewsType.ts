export interface AllApis {
  Api: ApiResponse;
}
export interface ApiResponse {
  version: string;
  title: string;
  home_page_url: string;
  feed_url: string;
  language: string;
  description: string;
  items: Item[];
}

export interface Item {
  id: string;
  url: string;
  title: string;
  content_text: string;
  content_html: string;
  image: string;
  date_published: string;
  authors: Author[];
  attachments: Attachment[];
}

export interface Author {
  name: string;
}

export interface Attachment {
  url: string;
}
