const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req,res) => { 
        res.json(
            {
                method:"GET"
            }
        )
    }
);

app.post('/register', (req,res) => {
        const uname = req.body.name;
        const upasswd = req.body.password;
        res.json(
            {
                nickname:uname,
                password:upasswd
            }
        );
    }
);

app.listen(3000);