import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { fetchBoardImages } from "../services/fetchApi";

jest.mock("../services/fetchApi", () => ({
  fetchBoardImages: jest.fn(),
}));

const mockedFetchBoardImages = fetchBoardImages as jest.Mock;

describe("Click the Fox game", () => {
  beforeEach(() => {
    mockedFetchBoardImages.mockReset();
    localStorage.clear();
  });

  it("lets the user start the game and gain a point when clicking a fox", async () => {
    const board1 = [
      { id: "1", type: "fox", url: "fox-1.jpg" },
      { id: "2", type: "dog", url: "dog-1.jpg" },
      { id: "3", type: "cat", url: "cat-1.jpg" },
      { id: "4", type: "dog", url: "dog-2.jpg" },
      { id: "5", type: "cat", url: "cat-2.jpg" },
      { id: "6", type: "dog", url: "dog-3.jpg" },
      { id: "7", type: "cat", url: "cat-3.jpg" },
      { id: "8", type: "dog", url: "dog-4.jpg" },
      { id: "9", type: "cat", url: "cat-4.jpg" },
    ];

    const board2 = [
      { id: "10", type: "fox", url: "fox-2.jpg" },
      { id: "11", type: "dog", url: "dog-5.jpg" },
      { id: "12", type: "cat", url: "cat-5.jpg" },
      { id: "13", type: "dog", url: "dog-6.jpg" },
      { id: "14", type: "cat", url: "cat-6.jpg" },
      { id: "15", type: "dog", url: "dog-7.jpg" },
      { id: "16", type: "cat", url: "cat-7.jpg" },
      { id: "17", type: "dog", url: "dog-8.jpg" },
      { id: "18", type: "cat", url: "cat-8.jpg" },
    ];

    mockedFetchBoardImages
      .mockResolvedValueOnce(board1)
      .mockResolvedValueOnce(board2)
      .mockResolvedValue(board2);

    const user = userEvent.setup();

    render(<App />);

    const input = screen.getByPlaceholderText(/enter your name/i);
    await user.type(input, "Justin");

    await user.click(screen.getByRole("button", { name: /play/i }));

    await user.click(screen.getByRole("button", { name: /play/i }));

    expect(await screen.findByText(/score:/i)).toHaveTextContent("Score: 0");

    const foxImage = await screen.findByAltText("fox");
    await user.click(foxImage);

    await waitFor(() => {
      expect(screen.getByText(/score:/i)).toHaveTextContent("Score: 1");
    });
  });

  it("shows the scoreboard when the timer ends", async () => {
    jest.useFakeTimers();

    const board1 = [
      { id: "1", type: "fox", url: "fox-1.jpg" },
      { id: "2", type: "dog", url: "dog-1.jpg" },
      { id: "3", type: "cat", url: "cat-1.jpg" },
      { id: "4", type: "dog", url: "dog-2.jpg" },
      { id: "5", type: "cat", url: "cat-2.jpg" },
      { id: "6", type: "dog", url: "dog-3.jpg" },
      { id: "7", type: "cat", url: "cat-3.jpg" },
      { id: "8", type: "dog", url: "dog-4.jpg" },
      { id: "9", type: "cat", url: "cat-4.jpg" },
    ];

    const board2 = [
      { id: "10", type: "fox", url: "fox-2.jpg" },
      { id: "11", type: "dog", url: "dog-5.jpg" },
      { id: "12", type: "cat", url: "cat-5.jpg" },
      { id: "13", type: "dog", url: "dog-6.jpg" },
      { id: "14", type: "cat", url: "cat-6.jpg" },
      { id: "15", type: "dog", url: "dog-7.jpg" },
      { id: "16", type: "cat", url: "cat-7.jpg" },
      { id: "17", type: "dog", url: "dog-8.jpg" },
      { id: "18", type: "cat", url: "cat-8.jpg" },
    ];

    mockedFetchBoardImages
      .mockResolvedValueOnce(board1)
      .mockResolvedValueOnce(board2)
      .mockResolvedValue(board2);

    const user = userEvent.setup({
      advanceTimers: jest.advanceTimersByTime,
    });

    render(<App />);

    await user.type(screen.getByPlaceholderText(/enter your name/i), "Justin");
    await user.click(screen.getByRole("button", { name: /play/i }));
    await user.click(screen.getByRole("button", { name: /play/i }));

    await screen.findByAltText("fox");

    await act(async () => {
      jest.advanceTimersByTime(30000);
    });

    expect(await screen.findByText(/justin/i)).toBeInTheDocument();

    await waitFor(() => {
      const storedScores = JSON.parse(
        localStorage.getItem("scoreboard") || "[]",
      );
      expect(storedScores).toHaveLength(1);
      expect(storedScores[0].playerName).toBe("Justin");
    });
  });
});
