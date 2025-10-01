export type MyRequestView = {
  number: string;
  areaName: string;
  categoryName: string;
  status: "open" | "client_closed" | "client_cancelled" | "system_cancelled";
  createdAt: string;
};



