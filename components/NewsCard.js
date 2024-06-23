import Link from "next/link";

const NewsCard = (list) => {
  return (
    <>
      {list.data.map((data, idx) => (
        <Link
          key={idx}
          href={data.url}
          className="card col-12 col-md-6 col-xl-4 mb-4"
        >
          <div className="row">
            {(data.urlToImage !== null || data.urlToImage === "[Removed]") && (
              <div className="col-12">
                <img
                  loading="lazy"
                  src={data.urlToImage}
                  alt={data.title}
                  className="w-100"
                />
              </div>
            )}
            {(data.title !== null || data.title === "[Removed]") && (
              <div className="col-12 text-center p-3">
                <strong>{data.title}</strong>
              </div>
            )}
            {(data.content !== null || data.content === "[Removed]") && (
              <>
                <hr Name="col-12" />
                <div className="col-12 text-center p-4">
                  <em>{data.content}</em>
                </div>
              </>
            )}
          </div>
        </Link>
      ))}
    </>
  );
};

export default NewsCard;
