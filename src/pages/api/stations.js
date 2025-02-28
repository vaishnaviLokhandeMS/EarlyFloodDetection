export default function handler(req, res) {
    if (req.method === "GET") {
      const stations = [
        { id: 1, name: "Sangli Station 1", lat: 16.85, lng: 74.57 },
        { id: 2, name: "Sangli Station 2", lat: 16.86, lng: 74.58 },
      ];
      res.status(200).json(stations);
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  }
  