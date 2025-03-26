const express=require("express");
const router=express.Router();
const db=require('../database');
const Fuse=require('fuse.js');
router.get("/:query", async function(req, res){
    try{
        const query=req.query.query?.toLowerCase() || '';
        const [subs]=await db.promise().query(`SELECT * FROM submission WHERE accepted=1`);
        const [domains]=await db.promise().query(`SELECT * FROM domains`);
        const fuse=new Fuse(subs,{
            keys: ['techname', 'tl1_desc', 'tl2_desc', 'tl3_desc', 'tl4_desc', 'link'],
            threshold: 0.4,
        });
        const tools=fuse.search(query);
        const toolIds=tools.map(t => t.item.id);
        const tags=domains.filter(d => toolIds.includes(d.id));
        res.render('searchpage',{
            tools: tools.map(t => t.item),
            tags,
            query
        });
    }
    catch (error){
        console.error(error);
        res.status(500).send('Server Error');
    }
});
module.exports=router;