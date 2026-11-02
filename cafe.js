const { db, createApp, asyncHandler, integer, cName, start } = require("./sample_common");
const app = createApp();

app.get("/", asyncHandler(async (req,res) => {
	await db.execute("select id, menu, price, category from cafe order by id asc");
	res.render("cafe", { menu: [], keyword: "" });
}));

app.post("/menu", asyncHandler(async (req, res) => {
	const menu = cName(req.body.menu);
	const price = integer(req.body.price);
	const category = cName(req.body.category);
	if (!menu || [...menu].length > 100 || price === null || price < -2147483648 || price > 2147483647) {
    return res.status(400).render("sample_error", { message: "입력값 또는 대상 ID를 확인하세요." });
  }
  await db.execute("INSERT INTO cafe (menu, price, category) VALUES (?, ?, ?)", [menu, price, category]);
  res.redirect(303, "/"); 
}));

app.post("/delete", asyncHandler(async (req, res) => {
	const id = integer(req.body.id);
	if (id === null || id <= 0) {
		return res.status(400).render("sample_error", {message : "입력값 또는 대상 ID를 확인하세요." });
	}
		const [result] = await db.execute("delete from cafe where id = ?", [id]);
		if (result.affectedRows === 0) return res.status(404).render("sample_error", {message : "입력값 또는 대상 ID를 확인하세요." });
	res.redirect(303, "/");
	}));

app.post("/update", asyncHandler(async (req, res) => {
	const id = integer(req.body.id);
	const menu = cName(req.body.menu);
	const price = integer(req.body.price);
	const category = cName(req.body.category);
	if (id === null || id <= 0 || !menu || [...menu].length > 100 || price == null || price < -2147483648 || price > 2147483647) {
		return res.status(400).render("sample_error", { message : "입력값 또는 대상 ID를 확인하세요." });
	}
	const [result] = await db.execute("update cafe set menu = ?, price = ?, category = ? where id = ?", [menu, price, category, id]);
	if (result.affectedRows === 0) return res.status(404).render("sample_error", { message: "입력값 또는 대상 ID를 확인하세요." });
  res.redirect(303, "/");
}));

app.post("/search", asyncHandler(async (req, res) => {
  const keyword = cName(req.body.keyword);
  const [menu] = await db.execute(
    "SELECT id, menu, price, category FROM cafe WHERE menu LIKE ? ORDER BY id asc",
    [`%${keyword}%`]
  );
  res.render("cafe", { menu, keyword });
}));

start(app, "검색");
