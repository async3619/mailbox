import React from "react";
import { render, screen } from "@testing-library/react";

import { Avatar } from "./Avatar";
import { AvatarSizes } from "./Avatar.styles";

describe("<Avatar />", () => {
    it("should render avatar correctly", () => {
        const { container } = render(<Avatar src="__MOCK__" />);
        const root = container.querySelector("div");

        expect(root).toBeInTheDocument();
        expect(root).toHaveStyle({
            background: "url(__MOCK__) no-repeat center center",
        });
    });

    it("should render two avatars when secondarySrc is provided", () => {
        const { container } = render(<Avatar src="__MOCK__" secondarySrc="__MOCK__" />);
        const secondaryRoot = container.querySelectorAll("div");

        expect(secondaryRoot.length).toBe(3);
    });

    it("should render avatars with given sizes", () => {
        const items = Object.entries(AvatarSizes);

        for (const [name, size] of items) {
            const { container } = render(<Avatar src="__MOCK__" size={name as any} />);
            const root = container.querySelector("div");

            expect(root).toHaveStyle({
                width: `${size}px`,
                height: `${size}px`,
            });
        }
    });

    it("should render tiny avatar when secondarySrc is provided", () => {
        render(<Avatar src="__MOCK__" secondarySrc="__MOCK__" />);

        const root = screen.getByTestId("secondary-avatar");

        expect(root).toHaveStyle({
            width: `${AvatarSizes.tiny}px`,
            height: `${AvatarSizes.tiny}px`,
        });
    });
});
