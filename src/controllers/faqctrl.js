const faqModel = require("../models/faq");

module.exports = {
    FAQInsert: async (req, res) => {
        const { title, question, description, } = req.body;
        try {
            const createfaq = await faqModel.create ({
                title: title,
                question: question,
                description: description,
            });
            res.json({ message: `${title} successfully created`, data: createfaq });
        } catch (error) {
            res.status(400).json({ message: "Insert Failed" });
        }
    },

    FAQGet: async (req, res) => {
        {
            try {
              //get faq
              const getFaq = await faqModel.findOne({
                _id: req.params.id,
              });
              res.status(200).json({ message: "Success get data", data: getFaq });
            } catch (error) {
              res.status(400).json({
                message: "Unsuccessfull get faq",
                message: error.message,
              });
            }
          }
    },

    FAQAll: async (req, res) => {
    try {
      console.log("");
      const allFAQ = await faqModel.find();
      console.log("");
      res.json({ message: `Success get data`, data: allFAQ });
    } catch (error) {
        res.status(400).json({ message: "Access data failed" });
    }
  }   
};

  //   FAQAll: async (req, res) => {
  //     {
  //         try {
  //           //get faq
  //           const FAQs = await faqModel.findAll();
  //           console.log(FAQs);
  //           res.status(200).json({ message: "Success get data", data: FAQs });
  //         } catch (error) {
  //           res.status(400).json({
  //             message: "Unsuccessfull get faq",
  //             message: error.message,
  //           });
  //         }
  //       }
  // },
  