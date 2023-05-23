interface Props {
  perPage: number;
  page: number;
  totalPages: number;
  totalItems: number;
  handleChangePage: (page: number) => void;
  handleChangeLimit: (limit: number) => void;
}

export const Pagination = ({
  perPage,
  page,
  totalPages,
  totalItems,
  handleChangePage,
  handleChangeLimit,
}: Props) => {
  return (
    <div className="flex gap-[20px] mx-auto w-fit mt-[20px]">
      <button className="border-[1px] border-[#808080] w-[80px] cursor-pointer">
        Previous
      </button>
      <div className="flex gap-[10px]">
        {Array(totalPages)
          .fill(totalPages)
          .map((_p: number, index: number) => (
            <button
              className={`border-[1px] p-[5px] border-[#000] ${
                index + 1 === page && "bg-[#808080] text-[#FFFFFF]"
              }`}
              onClick={() => handleChangePage(index + 1)}
              key={`page_${index}`}
            >
              {index + 1}
            </button>
          ))}
      </div>
      <button className="border-[1px] border-[#808080] w-[80px] cursor-pointer">
        Next
      </button>
    </div>
  );
};
