import { type HTTPMethod } from "@/app/types/http";
import { type HistoryItem } from "@/app/types/models";

export const MOCK_HISTORY: HistoryItem[] = [
  // GET requests - various statuses
  { method: "GET" as HTTPMethod, url: "localhost:3000/api/users", time: 82, status: 200, statusText: "OK" },
  { method: "GET" as HTTPMethod, url: "localhost:3000/api/users/1", time: 76, status: 200, statusText: "OK" },
  { method: "GET" as HTTPMethod, url: "localhost:3000/api/posts", time: 79, status: 200, statusText: "OK" },
  { method: "GET" as HTTPMethod, url: "localhost:3000/api/comments/123", time: 78, status: 404, statusText: "Not Found" },
  { method: "GET" as HTTPMethod, url: "localhost:3000/api/products", time: 89, status: 200, statusText: "OK" },
  { method: "GET" as HTTPMethod, url: "localhost:3000/api/orders", time: 95, status: 401, statusText: "Unauthorized" },
  { method: "GET" as HTTPMethod, url: "localhost:3000/api/settings", time: 71, status: 200, statusText: "OK" },
  { method: "GET" as HTTPMethod, url: "localhost:3000/api/dashboard", time: 115, status: 200, statusText: "OK" },
  
  // POST requests - various statuses
  { method: "POST" as HTTPMethod, url: "localhost:3000/api/users", time: 132, status: 201, statusText: "Created" },
  { method: "POST" as HTTPMethod, url: "localhost:3000/api/auth/login", time: 156, status: 200, statusText: "OK" },
  { method: "POST" as HTTPMethod, url: "localhost:3000/api/posts", time: 112, status: 201, statusText: "Created" },
  { method: "POST" as HTTPMethod, url: "localhost:3000/api/comments", time: 98, status: 400, statusText: "Bad Request" },
  { method: "POST" as HTTPMethod, url: "localhost:3000/api/uploads", time: 234, status: 201, statusText: "Created" },
  { method: "POST" as HTTPMethod, url: "localhost:3000/api/webhooks", time: 87, status: 500, statusText: "Internal Server Error" },
  { method: "POST" as HTTPMethod, url: "localhost:3000/api/notifications", time: 64, status: 201, statusText: "Created" },
  { method: "POST" as HTTPMethod, url: "localhost:3000/api/data", time: 145, status: 409, statusText: "Conflict" },
  
  // PATCH requests - update existing
  { method: "PATCH" as HTTPMethod, url: "localhost:3000/api/users/1", time: 105, status: 200, statusText: "OK" },
  { method: "PATCH" as HTTPMethod, url: "localhost:3000/api/posts/42", time: 89, status: 200, statusText: "OK" },
  { method: "PATCH" as HTTPMethod, url: "localhost:3000/api/profile", time: 76, status: 200, statusText: "OK" },
  { method: "PATCH" as HTTPMethod, url: "localhost:3000/api/settings/theme", time: 52, status: 204, statusText: "No Content" },
  { method: "PATCH" as HTTPMethod, url: "localhost:3000/api/users/999", time: 68, status: 404, statusText: "Not Found" },
  { method: "PATCH" as HTTPMethod, url: "localhost:3000/api/ite ms/5", time: 92, status: 200, statusText: "OK" },
  
  // PUT requests - replace entire resource
  { method: "PUT" as HTTPMethod, url: "localhost:3000/api/users/1", time: 128, status: 200, statusText: "OK" },
  { method: "PUT" as HTTPMethod, url: "localhost:3000/api/config", time: 156, status: 201, statusText: "Created" },
  { method: "PUT" as HTTPMethod, url: "localhost:3000/api/documents/doc1", time: 234, status: 200, statusText: "OK" },
  { method: "PUT" as HTTPMethod, url: "localhost:3000/api/invalid/data", time: 73, status: 400, statusText: "Bad Request" },
  
  // DELETE requests
  { method: "DELETE" as HTTPMethod, url: "localhost:3000/api/users/999", time: 84, status: 204, statusText: "No Content" },
  { method: "DELETE" as HTTPMethod, url: "localhost:3000/api/posts/42", time: 76, status: 204, statusText: "No Content" },
  { method: "DELETE" as HTTPMethod, url: "localhost:3000/api/comments/123", time: 59, status: 404, statusText: "Not Found" },
  { method: "DELETE" as HTTPMethod, url: "localhost:3000/api/admin/users/1", time: 91, status: 403, statusText: "Forbidden" },
  { method: "DELETE" as HTTPMethod, url: "localhost:3000/api/files/old.txt", time: 67, status: 204, statusText: "No Content" },
  
  // Second batch with variety
  { method: "GET" as HTTPMethod, url: "localhost:3000/api/search?q=test", time: 234, status: 200, statusText: "OK" },
  { method: "POST" as HTTPMethod, url: "localhost:3000/api/search", time: 198, status: 201, statusText: "Created" },
  { method: "GET" as HTTPMethod, url: "localhost:3000/api/analytics", time: 512, status: 200, statusText: "OK" },
  { method: "PATCH" as HTTPMethod, url: "localhost:3000/api/analytics/1", time: 87, status: 200, statusText: "OK" },
  { method: "DELETE" as HTTPMethod, url: "localhost:3000/api/analytics/old", time: 45, status: 204, statusText: "No Content" },
  
  { method: "GET" as HTTPMethod, url: "localhost:3000/api/logs", time: 423, status: 200, statusText: "OK" },
  { method: "POST" as HTTPMethod, url: "localhost:3000/api/logs", time: 76, status: 201, statusText: "Created" },
  { method: "GET" as HTTPMethod, url: "localhost:3000/api/logs/error", time: 312, status: 200, statusText: "OK" },
  { method: "PUT" as HTTPMethod, url: "localhost:3000/api/logs/config", time: 89, status: 200, statusText: "OK" },
  { method: "DELETE" as HTTPMethod, url: "localhost:3000/api/logs/2024-01-01", time: 234, status: 204, statusText: "No Content" },
  
  // Third batch with error scenarios
  { method: "GET" as HTTPMethod, url: "localhost:3000/api/status", time: 1250, status: 503, statusText: "Service Unavailable" },
  { method: "POST" as HTTPMethod, url: "localhost:3000/api/payment", time: 89, status: 402, statusText: "Payment Required" },
  { method: "GET" as HTTPMethod, url: "localhost:3000/api/premium", time: 78, status: 403, statusText: "Forbidden" },
  { method: "PATCH" as HTTPMethod, url: "localhost:3000/api/data/locked", time: 92, status: 423, statusText: "Locked" },
  { method: "DELETE" as HTTPMethod, url: "localhost:3000/api/protected", time: 64, status: 401, statusText: "Unauthorized" },
  
  { method: "GET" as HTTPMethod, url: "localhost:3000/api/export", time: 856, status: 200, statusText: "OK" },
  { method: "POST" as HTTPMethod, url: "localhost:3000/api/import", time: 2134, status: 413, statusText: "Payload Too Large" },
  { method: "GET" as HTTPMethod, url: "localhost:3000/api/cache", time: 12, status: 200, statusText: "OK" },
  { method: "PUT" as HTTPMethod, url: "localhost:3000/api/cache/clear", time: 34, status: 204, statusText: "No Content" },
  { method: "DELETE" as HTTPMethod, url: "localhost:3000/api/sessions/old", time: 89, status: 204, statusText: "No Content" },
  
  // Fourth batch - mixed operations
  { method: "GET" as HTTPMethod, url: "localhost:3000/api/users?page=1", time: 145, status: 200, statusText: "OK" },
  { method: "POST" as HTTPMethod, url: "localhost:3000/api/batch/process", time: 456, status: 202, statusText: "Accepted" },
  { method: "GET" as HTTPMethod, url: "localhost:3000/api/events", time: 234, status: 200, statusText: "OK" },
  { method: "PATCH" as HTTPMethod, url: "localhost:3000/api/events/1", time: 67, status: 200, statusText: "OK" },
  { method: "DELETE" as HTTPMethod, url: "localhost:3000/api/events/past", time: 123, status: 204, statusText: "No Content" },
  
  { method: "GET" as HTTPMethod, url: "localhost:3000/api/health", time: 23, status: 200, statusText: "OK" },
  { method: "GET" as HTTPMethod, url: "localhost:3000/api/metrics", time: 567, status: 200, statusText: "OK" },
  { method: "POST" as HTTPMethod, url: "localhost:3000/api/metrics/report", time: 234, status: 201, statusText: "Created" },
  { method: "PUT" as HTTPMethod, url: "localhost:3000/api/subscriptions/1", time: 145, status: 200, statusText: "OK" },
  { method: "DELETE" as HTTPMethod, url: "localhost:3000/api/subscriptions/1", time: 89, status: 204, statusText: "No Content" },
];
