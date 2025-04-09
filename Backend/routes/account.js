const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/user', (req, res) => {
  const sql = ` SELECT u.*, r.Role_ID FROM User u
                JOIN Role r on u.Role_ID = r.Role_ID
                GROUP BY u.User_ID ORDER BY u.User_ID DESC`;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

router.get('/role', (req,res) => {
  const sqlcommand = `select * from Role`
  db.query(sqlcommand, (err,result) => {
    if (err)
      {
        return res.json(err)
      }
      else
      {
        res.json(result)
      }
  })
})

router.get('/bookinghistory', (req,res) => {
  const sqlcommand = `SELECT p.Province_Name, br.Brand_Name, m.Model_Year, mn.Model_Name, c.Car_RegisNum, u.User_ID, b.*,
      GROUP_CONCAT(DISTINCT sv.Service_Name SEPARATOR '\n') AS Service,
      GROUP_CONCAT(DISTINCT CONCAT(sp.SparePart_Name, ' (จำนวน : ', bsp.Booking_SparePart_Quantity, ')') SEPARATOR '\n') AS SparePart_Details
      FROM Booking b
      JOIN Car c ON c.Car_ID = b.Car_ID
      JOIN Province p ON c.Province_ID = p.Province_ID
      JOIN Model m ON c.Model_ID = m.Model_ID
      JOIN Model_Name mn ON mn.Model_Name_ID = m.Model_Name_ID
      JOIN User u ON c.User_ID = u.User_ID
      JOIN Brand br ON br.Brand_ID = m.Brand_ID
      LEFT JOIN Booking_Service bsrv ON bsrv.Booking_ID = b.Booking_ID
      LEFT JOIN Service sv ON sv.Service_ID = bsrv.Service_ID
      LEFT JOIN Booking_Sparepart bsp ON bsp.Booking_ID = b.Booking_ID
      LEFT JOIN Sparepart sp ON sp.SparePart_ID = bsp.SparePart_ID
	    GROUP BY b.Booking_ID ORDER BY b.Booking_Date DESC, b.Booking_Time DESC;
  `
  db.query(sqlcommand, (err,result) => {
    if (err)
      {
        return res.json(err)
      }
      else
      {
        res.json(result)
      }
  })
})

router.post('/bookinghistory/:id', (req, res) => {
  const { carID } = req.body;
  const id = req.params.id;

  let querydata = [id];
  let sqlcommand = `
      SELECT p.Province_Name, br.Brand_Name, m.Model_Year, mn.Model_Name, c.Car_RegisNum, u.User_ID, b.*,
      GROUP_CONCAT(DISTINCT sv.Service_Name SEPARATOR '\n') AS Service,
      GROUP_CONCAT(DISTINCT CONCAT(sp.SparePart_Name, ' (จำนวน : ', bsp.Booking_SparePart_Quantity, ')') SEPARATOR '\n') AS SparePart_Details
      FROM Booking b
      JOIN Car c ON c.Car_ID = b.Car_ID
      JOIN Province p ON c.Province_ID = p.Province_ID
      JOIN Model m ON c.Model_ID = m.Model_ID
      JOIN Model_Name mn ON mn.Model_Name_ID = m.Model_Name_ID
      JOIN User u ON c.User_ID = u.User_ID
      JOIN Brand br ON br.Brand_ID = m.Brand_ID
      LEFT JOIN Booking_Service bsrv ON bsrv.Booking_ID = b.Booking_ID
      LEFT JOIN Service sv ON sv.Service_ID = bsrv.Service_ID
      LEFT JOIN Booking_Sparepart bsp ON bsp.Booking_ID = b.Booking_ID
      LEFT JOIN Sparepart sp ON sp.SparePart_ID = bsp.SparePart_ID
      WHERE u.User_ID = ?
  `;

  if (carID && carID !== '') {
    sqlcommand += ` AND c.Car_ID = ?`;
    querydata.push(carID);
  }

  sqlcommand += " GROUP BY b.Booking_ID ORDER BY b.Booking_Date DESC, b.Booking_Time DESC"

  db.query(sqlcommand, querydata, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    } else {
      return res.json(result);
    }
  });
});

router.get('/cardropdown/:id', (req,res) => {
  const id = req.params.id
  console.log(id)
  const sql = `SELECT DISTINCT c.Car_ID, c.Car_RegisNum, p.Province_Name
        FROM Car c
        JOIN Province p ON c.Province_ID = p.Province_ID
        JOIN User u ON c.User_ID = u.User_ID
        WHERE u.User_ID = ?`
  db.query(sql,id, (err,result) => {
    if (err)
      {
        return res.json(err)
      }
      else
      {
        res.json(result)
      }
  })
})


router.post('/searchuser', (req, res) => {
  const { searchname, role } = req.body;
  let condition = [];
  let querydata = [];

  let sqlcommand = `SELECT u.*, r.Role_Name,
                    GROUP_CONCAT(c.Car_RegisNum SEPARATOR ', ') AS Car_RegisNums
                    FROM User u 
                    JOIN Role r ON u.Role_ID = r.Role_ID
                    LEFT JOIN Car c on c.User_ID = u.User_ID`;

  if (searchname && searchname.trim() !== "") {
    condition.push(`(
      u.User_Username LIKE CONCAT('%', ?, '%') OR 
      u.User_FirstName LIKE CONCAT('%', ?, '%') OR 
      u.User_LastName LIKE CONCAT('%', ?, '%') OR 
      c.Car_RegisNum LIKE CONCAT('%', ?, '%')
    )`);
    querydata.push(searchname,searchname,searchname,searchname);
  }

  if (role && role !== "") {
    condition.push("r.Role_Name = ?");
    querydata.push(role);
  }

  if (condition.length > 0) {
    sqlcommand += " WHERE " + condition.join(" AND ");
  }

  sqlcommand += " GROUP BY u.User_ID ORDER BY u.User_ID DESC";

  db.query(sqlcommand, querydata, (err, result) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(result);
    }
  });
});




router.post('/updaterole',(req,res) => {
    const userid = req.body.User_ID
    const Role_ID = req.body.Role_ID
    const sqlcommand = `update User set Role_ID = ? where User_ID = ?`
    db.query(sqlcommand,[Role_ID,userid],(err,result) => {
      if (err)
        {
          return res.json(err)
        }
        else
        {
          res.json(result)
        }
    })
})

router.delete('/deleteaccount/:id', (req,res) => {
  const deleteid = req.params.id;
  const sqlcommand = 'delete from User where User_ID = ?'
  db.query(sqlcommand,[deleteid],(err,result) => {
    if (err)
      {
        return res.json(err)
      }
      else
      {
        res.json(result)
      }
  })
})

module.exports = router;