import "./PolicyComponent.css";

export const PolicyComponent = ({PolicyDetails}) => {
  return (
    <div> 
      <div className="diwenrwer">
            {PolicyDetails.data?.banner_image && (
                <img
                src={`${PolicyDetails.image_url}/${PolicyDetails.data.banner_image}`}
                className="img-fluid"
                alt=""
                />
            )}
        </div>

        <div className="cuisdjrwerwer py-5">
            <div className="container">
                <h1>{PolicyDetails.data?.title &&
              PolicyDetails.data.title}</h1>

                <hr style={{ background: "linear-gradient(45deg, var(--main-green-color), var(--blue-primary-color))", width: "5rem", paddingBottom: "5px", opacity: 1, borderRadius: "10px", borderTop: 0 }} />

                <div
                    dangerouslySetInnerHTML={{
                    __html:
                        PolicyDetails.data?.description &&
                        PolicyDetails.data.description,
                    }}
                />
            </div>
        </div>
    </div>
  );
};