import React from "react";

const Filtrar = () => {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#fcf8f9] overflow-x-hidden" style={{ fontFamily: '"Be Vietnam Pro", "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-80">
            <h2 className="text-[#1b0e11] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Filter</h2>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <div className="flex w-full flex-1 items-stretch rounded-xl">
                  <input
                    placeholder="Search"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1b0e11] focus:outline-0 focus:ring-0 border-none bg-[#f3e7ea] focus:border-none h-14 placeholder:text-[#994d61] p-4 rounded-r-none border-r-0 pr-2 text-base font-normal leading-normal"
                  />
                  <div className="text-[#994d61] flex border-none bg-[#f3e7ea] items-center justify-center pr-4 rounded-r-xl border-l-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                    </svg>
                  </div>
                </div>
              </label>
            </div>
            <div className="flex gap-3 p-3 overflow-x-hidden">
              {["Italian", "Mexican", "Chinese", "Indian", "Thai", "American"].map((cuisine, index) => (
                <div key={index} className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#f3e7ea] pl-4 pr-4">
                  <p className="text-[#1b0e11] text-sm font-medium leading-normal">{cuisine}</p>
                </div>
              ))}
            </div>
            <div className="relative flex w-full flex-col items-start justify-between gap-3 p-4">
              <div className="flex w-full shrink-[3] items-center justify-between">
                <p className="text-[#1b0e11] text-base font-medium leading-normal">Cooking time</p>
                <p className="text-[#1b0e11] text-sm font-normal leading-normal">15 min</p>
              </div>
              <div className="flex h-4 w-full items-center gap-4">
                <div className="flex h-1 flex-1 rounded-sm bg-[#e7d0d6]">
                  <div className="h-full w-[32%] rounded-sm bg-[#a61139]"></div>
                  <div className="relative">
                    <div className="absolute -left-2 -top-1.5 size-4 rounded-full bg-[#a61139]"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-3 overflow-x-hidden">
              {["Easy", "Intermediate", "Hard", "Master", "Ninja"].map((difficulty, index) => (
                <div key={index} className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#f3e7ea] pl-4 pr-4">
                  <p className="text-[#1b0e11] text-sm font-medium leading-normal">{difficulty}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3 p-3 flex-wrap pr-4">
              {["Vegetarian", "Vegan", "Gluten-free", "Dairy-free", "Nut-free", "Soy-free", "Fish-free"].map((diet, index) => (
                <div key={index} className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#f3e7ea] pl-4 pr-4">
                  <p className="text-[#1b0e11] text-sm font-medium leading-normal">{diet}</p>
                </div>
              ))}
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <textarea
                  placeholder="Add ingredients"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1b0e11] focus:outline-0 focus:ring-0 border-none bg-[#f3e7ea] focus:border-none min-h-36 placeholder:text-[#994d61] p-4 text-base font-normal leading-normal"
                ></textarea>
              </label>
            </div>
            <div className="flex px-4 py-3">
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 flex-1 bg-[#a61139] text-[#fcf8f9] text-sm font-bold leading-normal tracking-[0.015em]">
                <span className="truncate">Apply Filters</span>
              </button>
            </div>
          </div>
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-[#1b0e11] tracking-light text-[32px] font-bold leading-tight">Find the perfect recipe</p>
                <p className="text-[#994d61] text-sm font-normal leading-normal">4,000+ recipes. 1,000+ reviews. Unlimited possibilities.</p>
              </div>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
              {[
                { title: "Chicken Alfredo", stars: "4.8 stars (1,200 reviews)", time: "25 min", image: "https://cdn.usegalileo.ai/sdxl10/ecb98ece-d4ed-439c-8d71-9284934f21a8.png" },
                { title: "Vegetable Stir Fry", stars: "4.7 stars (1,500 reviews)", time: "20 min", image: "https://cdn.usegalileo.ai/sdxl10/6bb41e5f-34f8-46d9-ad9a-7bb2ea999982.png" },
                { title: "Pesto Pasta", stars: "4.9 stars (1,300 reviews)", time: "30 min", image: "https://cdn.usegalileo.ai/sdxl10/a8e025bc-f77a-4597-9ce5-9702cde8422e.png" },
                { title: "Tofu Scramble", stars: "4.6 stars (1,000 reviews)", time: "15 min", image: "https://cdn.usegalileo.ai/sdxl10/ba9a501f-e1af-400f-9e66-e4bda7a83026.png" },
                { title: "Beef Tacos", stars: "4.5 stars (1,400 reviews)", time: "35 min", image: "https://cdn.usegalileo.ai/sdxl10/13fa0032-017c-48cf-8323-4b10ef5ea1a4.png" },
                { title: "Garden Salad", stars: "4.7 stars (1,100 reviews)", time: "10 min", image: "https://cdn.usegalileo.ai/sdxl10/e9443963-0f4b-49c0-b6ba-aa2d1c52bc7f.png" },
              ].map((recipe, index) => (
                <div key={index} className="flex flex-col gap-3 pb-3">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                    style={{ backgroundImage: `url(${recipe.image})` }}
                  ></div>
                  <div>
                    <p className="text-[#1b0e11] text-base font-medium leading-normal">{recipe.title}</p>
                    <p className="text-[#994d61] text-sm font-normal leading-normal">{recipe.stars}</p>
                    <p className="text-[#994d61] text-sm font-normal leading-normal">{recipe.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filtrar;