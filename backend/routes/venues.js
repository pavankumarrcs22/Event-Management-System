router.get('/:id', (req, res) => {
    const venueId = req.params.id;
    const query = 'SELECT * FROM venues WHERE id = ?';
  
    db.query(query, [venueId], (err, results) => {
      if (err) {
        console.error('Error fetching venue:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Venue not found' });
      }
      res.json(results[0]);
    });
  });
  