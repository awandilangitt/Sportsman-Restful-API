const router = require("express").Router();
const faqCtrl = require("../controllers/faqctrl");

router.post("/faq", faqCtrl.FAQInsert);
router.get("/faq/all", faqCtrl.FAQAll);
router.get("/faq/:id", faqCtrl.FAQGet);


module.exports = router;