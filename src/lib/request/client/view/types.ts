export type RequestView = {
  id: number;
  number: string;
  areaName: string;
  categoryName: string;
  status: "open" | "client_closed" | "client_cancelled" | "system_cancelled";
  createdAt: string;
  requestType: string;
  budget: string;
  comment: string | null;
  proposalsCount: number;
};

export type AccomodationRequestView = RequestView & {
  dateFrom?: string;
  dateTo?: string;
  adultsQty?: number;
  kidsQty?: number;
};

export type TransportRequestView = RequestView & {
  provisionTime?: string;
  adultsQty?: number;
  kidsQty?: number;
};

export type EntertainmentRequestView = RequestView & {
  provisionTime?: string;
  adultsQty?: number;
};

export type AnyRequestView = AccomodationRequestView | TransportRequestView | EntertainmentRequestView;



