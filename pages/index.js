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
  const [error, setError] = useState("");

  const handleFeedType = (e) => {
    setFeedType(e.target.value);
  };
  const handleQuery = (e) => {
    setQuery(encodeURIComponent(e.target.value));
    console.log("query: ", query);
  };
  const handleCategory = (e) => {
    setCategory(e.target.value);
  };
  const handleCountry = (e) => {
    setCountry(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };
  const fetchData = async () => {
    setIsLoading(true);
    await axios
      .get(
        `https://cms-backend-kka3.vercel.app/newsapi/data/${feedtype}/${
          query === "" ? undefined : query
        }/${category}/${country}`
      )
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
        console.log(data);
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err.message);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>News App React</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
          crossorigin="anonymous"
        />
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
        <div className="accordion" id="accordionExample">
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
                  Search Control
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
                  <select
                    name="feedType"
                    className="form-select w-100 mb-2"
                    onChange={handleFeedType}
                    defaultValue={feedtype}
                  >
                    <option disabled>Choose a Feed Type</option>
                    <option value="all" selected>
                      Everything
                    </option>
                    <option value="top">Headlines</option>
                  </select>
                  {feedtype === "all" && (
                    <>
                      <input
                        placeholder="Search something.."
                        type="text"
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
                        <option value="science" selected>
                          Science
                        </option>
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
                    className="btn btn-secondary w-100"
                    onClick={handleSubmit}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="divider"></div>
        {loading && (
          <div className="output">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        {!loading && error === "" && data !== undefined && data.length !== 0 ? (
          <>
            {data.map((data, idx) => (
              <Link
                key={idx}
                href={data.url}
                className="card bg-secondary col-12 col-md-6 col-xl-4 mb-4 overflow-hidden"
              >
                <div className="row">
                  {(data.urlToImage !== null ||
                    data.urlToImage === "[Removed]") && (
                    <div className="col-12 p-0">
                      <img
                        loading="lazy"
                        src={data.urlToImage}
                        alt={data.title}
                        className="w-100"
                      />
                    </div>
                  )}
                  {(data.title !== null || data.title === "[Removed]") && (
                    <div className="col-12 text-center text-light p-3">
                      <strong>{data.title}</strong>
                    </div>
                  )}
                  {(data.content !== null || data.content === "[Removed]") && (
                    <>
                      <hr Name="col-12" />
                      <div className="col-12 text-center text-light pt-0 p-4">
                        <em
                          dangerouslySetInnerHTML={{
                            __html: data.content.split("[")[0],
                          }}
                        ></em>
                      </div>
                    </>
                  )}
                  {(data.publishedAt !== null ||
                    data.publishedAt === "[Removed]") && (
                    <>
                      <hr Name="col-12" />
                      <div className="col-12 text-center text-light pt-0 p-3">
                        <em>
                          Release date:{" "}
                          {new Date(data.publishedAt).toDateString()}
                        </em>
                      </div>
                    </>
                  )}
                </div>
              </Link>
            ))}
          </>
        ) : (
          <h2 className="text-light">{error}</h2>
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
