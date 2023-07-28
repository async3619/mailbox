import { render, screen } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material";

import { UserLink } from "./UserLink";
import { PostAuthor } from "../services/types";

const MOCK_USER: PostAuthor = {
    accountId: "@sophia_dev@silicon.moe",
    accountName: "sophia_dev",
    instanceUrl: "social.silicon.moe",
    avatarUrl: "",
};

describe("<UserLink />", () => {
    it("should render UserLink correctly", () => {
        render(
            <ThemeProvider theme={createTheme()}>
                <UserLink user={MOCK_USER} />
            </ThemeProvider>,
        );

        const root = screen.getByRole("link");
        expect(root).toBeInTheDocument();
    });

    it("should point to the correct user profile url", () => {
        render(
            <ThemeProvider theme={createTheme()}>
                <UserLink user={MOCK_USER} />
            </ThemeProvider>,
        );

        const root = screen.getByRole("link");
        expect(root).toHaveAttribute("href", "https://social.silicon.moe/@sophia_dev");
    });
});
