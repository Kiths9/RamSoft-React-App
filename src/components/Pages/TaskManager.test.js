import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import TaskManager from "./TaskManager"; // Make sure to import your TaskManager component

// Mock the global fetch function to simulate API calls
global.fetch = jest.fn();

describe("TaskManager", () => {
  // Before each test, clear any previous mock calls to ensure clean slate
  beforeEach(() => {
    fetch.mockClear();
  });

  it("should display the tasks", async () => {
    // Mock the fetch response to return sample tasks when the component fetches data
    fetch.mockResolvedValueOnce({
      json: () =>
        Promise.resolve([
          { id: "323b", title: "asdasd", status: "deleted", summary: "asdasd" },
          {
            id: "d877",
            title: "asdasdsadasdasd",
            status: "deleted",
            summary: "asdasdasdasd",
          },
        ]),
    });

    render(<TaskManager />); // Render the TaskManager component

    // Wait for the API response and check if the tasks are rendered correctly
    await waitFor(() => {
      expect(screen.getByText("asdasd")).toBeInTheDocument(); // Ensure "asdasd" task is rendered
      expect(screen.getByText("asdasdsadasdasd")).toBeInTheDocument(); // Ensure second task is rendered
    });
  });

  // Another beforeEach to mock the fetch response for a different test
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            {
              id: "3",
              title: "Deploy API",
              status: "active",
              summary: "Deploy the backend API to production.",
            },
          ]),
      })
    );
  });

  // Clear all mock calls after each test to avoid any conflicts
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should open the dropdown menu when clicking task title", async () => {
    render(<TaskManager />); // Render the TaskManager component

    // Wait for the task to be displayed and find the task title
    const taskTitle = await waitFor(() => screen.getByTestId("task-title-3"));
    expect(taskTitle).toBeInTheDocument(); // Ensure the task title is rendered

    // Simulate a click on the task title to open the dropdown menu
    fireEvent.click(taskTitle);

    // Ensure that the menu opens and "View" option is visible
    await waitFor(() => expect(screen.getByText("View")).toBeInTheDocument());
  });

  it("should filter tasks based on search query", async () => {
    // Mock the fetch response with multiple tasks for testing search functionality
    fetch.mockResolvedValueOnce({
      json: () =>
        Promise.resolve([
          { id: "323b", title: "asdasd", status: "deleted", summary: "asdasd" },
          { id: "d877", title: "task2", status: "deleted", summary: "asdasd" },
          { id: "d878", title: "task3", status: "deleted", summary: "asdasd" },
        ]),
    });

    render(<TaskManager />); // Render the TaskManager component

    // Wait for all tasks to be displayed
    await waitFor(() => screen.getByText("asdasd"));
    await waitFor(() => screen.getByText("task2"));
    await waitFor(() => screen.getByText("task3"));

    // Simulate typing in the search bar with a query
    fireEvent.change(screen.getByLabelText("Search Tasks"), {
      target: { value: "task2" },
    });

    // Check if only the task matching the query is displayed
    await waitFor(() => expect(screen.getByText("task2")).toBeInTheDocument());
    expect(screen.queryByText("asdasd")).not.toBeInTheDocument(); // Ensure non-matching tasks are not displayed
  });
});
