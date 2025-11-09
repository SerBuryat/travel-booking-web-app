export type RequestView = {
  id: number;
  number: string;
  areaName: string;
  categoryName: string;
  status: "open" | "closed" | "cancelled";
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

export type FoodRequestView = RequestView & {
  provisionTime?: string;
  adultsQty?: number;
  kidsQty?: number;
};

export type HealthRequestView = RequestView & {
  provisionTime?: string;
  adultsQty?: number;
};

export type PackageRequestView = RequestView & {
  provisionTime?: string;
  adultsQty?: number;
  kidsQty?: number;
  startDate?: string;
  nightsFrom?: number;
  nightsTo?: number;
};

export type AnyRequestView = AccomodationRequestView | TransportRequestView | EntertainmentRequestView | FoodRequestView | HealthRequestView | PackageRequestView;



