export const catchError = (error) => {
  if (error?.name === "AxiosError") {
    if (
      error.response.data.message ==
      "Something went wrong: check the error log for error details"
    ) {
      throw new Error("System Error: Please try again later");
    }
    throw new Error(error.response.data.message);
  } else {
    throw new Error("System Error: Please try again later");
  }
};
