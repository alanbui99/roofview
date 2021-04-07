const rooftopsService = require("../services/rooftops.service");
const {getReviewByUserId} = require("../services/reviews.service");
const AppError = require("../utils/AppError")

exports.getList = async (req, res, next) => {
  try {
    let rooftops;

    if (req.query.search) {
      rooftops = await rooftopsService.getSearchedRooftops(req.query.search)
    } else if (req.query.sort) {
      rooftops = await rooftopsService.getSortedRooftops(req.query.sort)
    } else {
      rooftops = await rooftopsService.getMultipleRooftops()
    }

    res.render("./rooftops/list", {
      rooftops,
      page: "rooftops",
      search: req.query.search,
      numResults: req.query.search ? rooftops.length : undefined
    });

  } catch (err) {
    next(err)
  }
}

exports.getRooftop = async (req, res, next) => {
  try {
    const rooftop = await rooftopsService.getRooftopById(req.params.id);
    if (!rooftop) throw new AppError("Rooftop not found", 404);

    let selfReview;
    if (req.user) {
      selfReview = await getReviewByUserId(req.user.id, req.params.id);
    }



    res.render("./rooftops/show", { rooftop, selfReview, invalidReview: req.session.invalidReview });
  } catch (err) {
    next(err)
  }
};

exports.getNew = (req, res, next) => {
  res.render("./rooftops/form", {
    purpose: "new",
  });
};

exports.postNew = async (req, res, next) => {
  try {
    const newRooftop = await rooftopsService.createRooftop({
      ...req.body,
      author,
    });

    req.flash("success", `Successfully created ${newRooftop.name}!`);
    res.redirect(`/rooftops/${newRooftop._id}`);

  } catch (err) {
    console.log(err);
    res.status(422).render("./rooftops/form", {
      purpose: "new",
      prevInput: { ...req.body },
      errMsg: err.message,
    });
  }
};

exports.getEdit = async (req, res, next) => {
  try {
    const rooftop = await rooftopsService.getRooftopById(req.params.id, false);
    res.render("./rooftops/form", {
      purpose: "edit",
      prevInput: rooftop,
    });
  } catch (err) {
    next(new AppError("Rooftop not found", 404))
  }
};

exports.putEdit = async (req, res, next) => {
  try {
    const author = null;
    const editedRooftop = await rooftopsService.updateRooftopById(
      req.params.id,
      { ...req.body, author }
    );

    req.flash("success", `Successfully updated ${editedRooftop.name}!`);
    res.redirect(`/rooftops/${editedRooftop._id}`);
  } catch (err) {
    console.log(err)
    res.status(422).render('./rooftops/form', {
      purpose: 'edit',
      prevInput: {...req.body},
      errMsg: err.message
    })
  }
};

exports.deleteRooftop = async (req, res, next) => {
  try {
    const deletedRooftop = await rooftopsService.deleteRooftopById(req.params.id);
    req.flash("success", `Successfully deleted ${deletedRooftop.name}!`);
    res.redirect("back/rooftops");
  } catch (err) {
    next(err)
  }
};