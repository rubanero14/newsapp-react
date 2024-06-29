import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

//For ENV VARS
// import getConfig from "next/config";
// const { publicRuntimeConfig } = getConfig();

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [data, setData] = useState([]);
  const [feedtype, setFeedType] = useState("top");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("entertainment");
  const [country, setCountry] = useState("us");
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [saveSearch, setSaveSearch] = useState([]);

  const handleQuery = (e) => {
    setQuery(encodeURIComponent(e.target.value));
  };
  const handleCategory = (e) => {
    setCategory(e.target.value);
  };
  const handleCountry = (e) => {
    setCountry(e.target.value);
  };

  const handleSaveSearch = () => {
    if (saveSearch.length > 0 && query.length > 0) {
      setSaveSearch([
        ...saveSearch,
        {
          id: new Date(),
          search: decodeURIComponent(query),
        },
      ]);
      localStorage.setItem(
        "savedSearches",
        JSON.stringify([
          ...saveSearch,
          {
            id: new Date(),
            search: decodeURIComponent(query),
          },
        ])
      );
    }

    if (saveSearch.length === 0 && query.length > 0) {
      setSaveSearch([
        {
          id: new Date(),
          search: decodeURIComponent(query),
        },
      ]);
      localStorage.setItem(
        "savedSearches",
        JSON.stringify([
          {
            id: new Date(),
            search: decodeURIComponent(query),
          },
        ])
      );
    }
  };

  const getSaveSearch = () => {
    if (localStorage.getItem("savedSearches")) {
      const data = JSON.parse(localStorage.getItem("savedSearches"));
      setSaveSearch(data);
    }
  };

  const removeBookmark = (id) => {
    setSaveSearch(saveSearch.filter((search) => search.id !== id));
    localStorage.setItem(
      "savedSearches",
      JSON.stringify(saveSearch.filter((search) => search.id !== id))
    );
  };

  const fetchBookmarkData = async (str) => {
    fetchData(str);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };
  const fetchData = async (str = null) => {
    setError(false);
    setIsLoading(true);
    const q = str !== null ? str : query === "" ? undefined : query;
    await axios
      .get(
        `https://cms-backend-gbhx.vercel.app/newsapi/data/${
          str !== null ? "all" : feedtype
        }/${q}/${category}/${country}`
      )
      .then((res) => {
        if (res.data.message) {
          setData(res.data);
          setError(true);
        } else {
          setData(res.data.articles);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setData(err);
        setIsLoading(false);
        setError(true);
      });
  };

  useEffect(() => {
    getSaveSearch();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>News App React</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="https://react.dev/favicon-32x32.png" />
      </Head>
      <main className={`${styles.main} ${inter.className} p-5 px-3`}>
        <h1 className="text-center mb-3">NEWS APP</h1>
        <h5 className="text-center mb-4">
          Powered by{" "}
          <img
            src="https://react.dev/favicon-32x32.png"
            alt="React"
            height="30"
            className="me-2"
            loading="lazy"
          />
          {"and "}
          <img
            src="https://newsapi.org/favicon.ico"
            alt="News API"
            height="30"
            loading="lazy"
          />
        </h5>
        <div className="accordion mb-3" id="accordionExample">
          <div className="accordion-item overflow-hidden">
            <strong>
              <h2 className="accordion-header">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  Search Controls
                </button>
              </h2>
            </strong>
            <div
              id="collapseOne"
              className="accordion-collapse collapse show"
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body row">
                <div className="col-12">
                  <div className="d-flex navi-wrapper justify-content-center align-items-center mb-3">
                    <button
                      className="btn navi btn-primary w-100"
                      onClick={() => setFeedType("top")}
                    >
                      Top Headlines
                    </button>
                    <button
                      className="btn navi btn-success w-100"
                      onClick={() => setFeedType("all")}
                    >
                      Custom Search
                    </button>
                  </div>
                  {feedtype === "all" && (
                    <>
                      <input
                        placeholder="Search something.."
                        type="search"
                        name="searchQuery"
                        className="form-control search w-100 mb-2"
                        onChange={handleQuery}
                        defaultValue={decodeURIComponent(query)}
                      />
                    </>
                  )}
                  {feedtype === "top" && (
                    <>
                      <select
                        name="category"
                        className="form-select hidden w-100 mb-2"
                        onChange={handleCategory}
                        defaultValue={category}
                      >
                        <option disabled>Choose a category</option>
                        <option value="business">Business</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="health">Health</option>
                        <option value="science">Science</option>
                        <option value="sports">Sports</option>
                        <option value="technology">Technology</option>
                        <option value="general">General</option>
                      </select>
                      <select
                        name="country"
                        className="form-select w-100 mb-2 hidden"
                        onChange={handleCountry}
                        defaultValue={country}
                      >
                        <option disabled>Choose a country</option>
                        <option value="my">Malaysia</option>
                        <option value="in" selected>
                          India
                        </option>
                        <option value="us">United States</option>
                        <option value="sg">Singapore</option>
                        <option value="au">Australia</option>
                        <option value="cn">China</option>
                        <option value="jp">Japan</option>
                        <option value="th">Thailand</option>
                      </select>
                    </>
                  )}
                  <button
                    className="btn btn-secondary w-100 mb-2"
                    onClick={handleSubmit}
                    type="submit"
                  >
                    Search
                  </button>
                  {feedtype === "all" && (
                    <button
                      className="btn btn-success w-100"
                      onClick={handleSaveSearch}
                    >
                      Bookmark This
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {saveSearch.length > 0 && (
          <div className="accordion" id="accordionExample1">
            <div className="accordion-item overflow-hidden">
              <strong>
                <h2 className="accordion-header">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo"
                    aria-expanded="true"
                    aria-controls="collapseTwo"
                  >
                    Bookmarked Searches
                  </button>
                </h2>
              </strong>
              <div
                id="collapseTwo"
                className="accordion-collapse collapse show"
                data-bs-parent="#accordionExample1"
              >
                <div className="accordion-body row">
                  {saveSearch.map((search) => (
                    <div
                      key={search.id}
                      className="d-flex bookmark justify-content-center align-items-center mb-3"
                    >
                      <button
                        onClick={() => fetchBookmarkData(search.search)}
                        className="btn btn-outline-secondary w-75"
                      >
                        {search.search.toUpperCase()}
                      </button>
                      <button
                        onClick={() => removeBookmark(search.id)}
                        className="btn btn-outline-danger w-25"
                      >
                        Del
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="divider"></div>
        {loading && (
          <div className="output">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        {!loading && !error && Array.isArray(data) && (
          <>
            {data?.map(
              (data, idx) =>
                !new Date(data.publishedAt).toDateString().includes("1970") && (
                  <Link
                    key={idx}
                    href={data.url}
                    className="card bg-secondary col-12 col-md-6 col-xl-4 mb-4 overflow-hidden"
                  >
                    <div className="row">
                      <div className="col-12 p-0">
                        <img
                          loading="lazy"
                          src={data.urlToImage}
                          alt={data.title}
                          className={
                            data.urlToImage === null ||
                            data.urlToImage === "[Removed]"
                              ? "d-none"
                              : "w-100"
                          }
                        />
                      </div>

                      <div
                        className={
                          data.title === null || data.title === "[Removed]"
                            ? "d-none"
                            : "col-12 text-center text-light p-3"
                        }
                      >
                        <strong>{data.title}</strong>
                      </div>
                      <hr Name="col-12 mt-0" />
                      <div
                        className={
                          data.content === null || data.content === "[Removed]"
                            ? "d-none"
                            : ""
                        }
                      >
                        <div className="col-12 text-center text-light pt-0 p-4">
                          <em
                            dangerouslySetInnerHTML={{
                              __html: data.content?.split("[")[0],
                            }}
                          ></em>
                        </div>
                      </div>
                      <hr
                        className={
                          data.content === null || data.content === "[Removed]"
                            ? "d-none"
                            : "col-12"
                        }
                      />
                      <div
                        className={
                          data.publishedAt === null ||
                          new Date(data.publishedAt)
                            .toDateString()
                            .includes("1970")
                            ? "d-none"
                            : ""
                        }
                      >
                        <div className="col-12 text-center text-light pt-0 p-3">
                          <em>
                            Release date:{" "}
                            {new Date(data.publishedAt).toDateString()}
                          </em>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
            )}
          </>
        )}
        {!loading && error && (
          <h2 className="text-center text-danger">{data.message}</h2>
        )}
        {!loading && !error && Array.isArray(data) && data.length === 0 && (
          <h2 className="text-center text-light">No results found.</h2>
        )}
      </main>
      <script
        defer
        src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"
        integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r"
        crossorigin="anonymous"
      ></script>
      <script
        defer
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js"
        integrity="sha384-0pUGZvbkm6XF6gxjEnlmuGrJXVbNuzT9qBBavbLwCsOGabYfZo0T0to5eqruptLy"
        crossorigin="anonymous"
      ></script>
    </>
  );
}
