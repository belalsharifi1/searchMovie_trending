
export default function Search({SearchTerm,SetSearchTerm}){
    return (
        <div className="search">
            <div>
                <img src="/public/search.svg" alt="" />
                <input
                    type="text"
                    placeholder="search your movies"
                    value={SearchTerm}
                    onChange={ (e) => SetSearchTerm(e.target.value)}
                />
            </div>
        </div>
    )
}

